import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

export const updateWar3NewsGA = {
  onGoing: () => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '魔獸/新聞/抓取最新',
      el: '',
      ev: 1,
    })
  },
}
