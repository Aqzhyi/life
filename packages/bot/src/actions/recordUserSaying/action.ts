import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { userModelAPI } from '@/lib/mongodb/models/user'

export const recordUserSayingAction: BottenderAction = async (
  context,
  props,
) => {
  if (isLineContext(context)) {
    const lineUser = await context.getUserProfile()
    const user = await userModelAPI.getByLineId(lineUser?.userId)

    if (!user) {
      await userModelAPI.newLineUser({
        userName: {
          line: lineUser?.displayName,
        },
        userId: {
          line: lineUser?.userId,
        },
      })
    } else {
      await userModelAPI.updateLastActive(lineUser?.userId)
    }
  }

  context.event.isText &&
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '訊息/發送',
      el: context.event.text,
      ev: 0.01,
    })

  return props.next
}
