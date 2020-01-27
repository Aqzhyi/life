import { LineContext } from 'bottender'
import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

const NS = '唬爛產生器'

export const events = {
  onQuery: (props: { topic: string; minLength: number }) => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `${NS}/產生`,
      el: props,
      ev: 2,
    })
  },
  onError: (props: { topic: string; minLength: number }) => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `${NS}/產生/錯誤`,
      el: props,
    })
  },
}
