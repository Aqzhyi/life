import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'
import { NewsDoc } from '@/lib/news/NewsDoc'

export const queryWar3NewsGA = {
  onQuery: () => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '查詢/魔獸爭霸/新聞',
      el: '',
      ev: 3,
    })
  },
  onResponsed: (data: NewsDoc[]) => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '查詢/魔獸爭霸/新聞/回應',
      el: `length=${data.length}`,
      ev: 1,
    })
  },
  onError: (error: Error) => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '查詢/魔獸爭霸/新聞/錯誤',
      el: `error.message=${error.message}`,
      ev: 0,
    })
  },
}
