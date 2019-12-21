import { LineContext } from 'bottender'
import delay from 'delay'
import day from 'dayjs'

export default async function App(context: LineContext) {
  const speakingUser = await context.getUserProfile()
  const speakingText: string = context.event.message.text.trim()
  if (
    speakingUser &&
    context.event.isText &&
    speakingText.startsWith('/remind')
  ) {
    type Pending = [string, 's' | 'm' | 'h']
    const orderArray = speakingText.split(' ')

    if (orderArray.length < 3) {
      await context.sendText(
        '/remind 指令不正確，請輸入例如 /remind 提醒我 要計得買水 30m',
      )
      return
    }

    const pendingText = orderArray[orderArray.length - 1]
    const remindText =
      orderArray.pop() &&
      orderArray.reverse() &&
      orderArray.pop() &&
      orderArray.reverse() &&
      orderArray.join(' ')

    if (!pendingText.match(/\d+[smh]/i)) {
      await context.sendText('日期格式不正確，請輸入例如 3m 30m 1h')
      return
    }

    const pending = [
      (pendingText.match(/\d+/i) || [])[0],
      (pendingText.match(/[smh]/i) || [])[0],
    ] as Pending

    const nowDate = day()
    const pendingDate = day().add(Number(pending[0]), pending[1])

    const delaySeconds = Number(pendingDate.diff(nowDate).toString())

    // FIXME: sendText() 會 batch send
    await context.sendText(
      // FIXME: '@Vice 阿轟 老胡 好我會在 12月21 08時55分06秒 提醒你' ＠不到
      `@${speakingUser.displayName} 好我會在 ${pendingDate.format(
        'MM月DD hh時mm分ss秒',
      )} 提醒你`,
    )

    await delay(delaySeconds)

    await context.sendText(`提醒 @${speakingUser.displayName}：${remindText}`)
  }
}
