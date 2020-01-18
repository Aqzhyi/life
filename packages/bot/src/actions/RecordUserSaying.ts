import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { gaAPI } from '@/lib/google-analytics/gaAPI'

export const RecordUserSaying: LineAction<WithGroupProps<{
  text: string
}>> = async (context, props) => {
  const inputText = props.match?.groups?.text || ''

  gaAPI.send({
    ec: 'linebot',
    ea: '其它訊息',
    el: inputText,
    ev: 1,
  })

  return props.next
}
