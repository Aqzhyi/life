import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { gaAPI } from '@/lib/gaAPI'
import { isLineContext } from '@/utils/isLineContext'
import { userModelAPI } from '@/lib/mongodb/models/userModelAPI'

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
      ec: gaAPI.EventCategory.LINEBOT,
      ea: '訊息/發送',
      el: context.event.text,
      ev: 0.01,
    })

  return props.next
}
