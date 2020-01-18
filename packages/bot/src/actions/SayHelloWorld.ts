import { LineAction } from '../lib/bottender-toolkit/types'

export const SayHelloWorld: LineAction = async (context, props) => {
  await context.sendText('歡迎使用 查詢 Twitch 直播')
  await context.sendText('你可以試著輸入指令 $直播[遊戲]，例如：')
  await context.sendText('$直播英雄')
  await context.sendText('來查詢直播頻道')
  await context.sendText(
    '更多消息請見 https://www.notion.so/hilezi/d7ac6acf3ee94029a245be3df3c9f5fe',
  )

  return props.next
}
