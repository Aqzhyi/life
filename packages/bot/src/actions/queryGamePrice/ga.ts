import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

export const queryGamePriceGa = {
  onQuery(keyword: string) {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `遊戲售價/查詢`,
      el: { keyword },
      ev: 5,
    })
  },
  onResponse(keyword: string) {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `遊戲售價/查詢/回應`,
      el: { keyword },
      ev: 5,
    })
  },
  onError(keyword: string, error: Error) {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `遊戲售價/查詢/回應`,
      el: { keyword, errorMessage: error.message },
      ev: 5,
    })
  },
}
