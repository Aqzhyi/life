import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

export const recordUserSayingAction: BottenderAction = async (
  context,
  props,
) => {
  context.event.isText &&
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '訊息/發送',
      el: context.event.text,
      ev: 0.01,
    })

  return props.next
}
