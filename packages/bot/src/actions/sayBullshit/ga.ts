import { gaAPI } from '@/lib/gaAPI'

const NS = '唬爛產生器'

export const sayBullshitGA = {
  onQuery: (props: { topic: string; minLength: number }) => {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: `${NS}/產生`,
      el: props,
      ev: 2,
    })
  },
  onError: (props: { topic: string; minLength: number }) => {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: `${NS}/產生/錯誤`,
      el: props,
    })
  },
}
