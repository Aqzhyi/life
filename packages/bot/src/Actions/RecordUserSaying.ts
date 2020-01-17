import { LineContext, LineEvent } from 'bottender'
import { Props, Client } from 'bottender/dist/types'
import { gaAPI } from '../lib/google-analytics/gaAPI'

export const RecordUserSaying = async (
  context: LineContext,
  props: Props<Client, LineEvent> & {
    match?: { groups?: { text?: string } }
  },
) => {
  const inputText = props.match?.groups?.text || ''

  gaAPI.send({
    ec: 'linebot',
    ea: '其它訊息',
    el: inputText,
    ev: 1,
  })

  return props.next
}
