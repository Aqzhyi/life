import { gaAPI } from '@/lib/gaAPI'

export const queryGamePriceGa = {
  onQuery(keyword: string) {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: `遊戲售價/查詢`,
      el: { keyword },
      ev: 5,
    })
  },
  onResponse(keyword: string) {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: `遊戲售價/查詢/回應`,
      el: { keyword },
      ev: 5,
    })
  },
  onError(keyword: string, error: Error) {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: `遊戲售價/查詢/回應`,
      el: { keyword, errorMessage: error.message },
      ev: 5,
    })
  },
}
