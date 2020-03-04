import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

export const querySteamWishlistGA = {
  onQuery() {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '查詢 Steam 願望單',
      el: '',
      ev: 10,
    })
  },
  onError(error: Error) {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '查詢 Steam 願望單/錯誤',
      el: error.message,
      ev: 10,
    })
  },
}
