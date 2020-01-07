import { LineContext } from 'bottender'
import { Props, Client, Event, Action } from 'bottender/dist/types'
import { parseTimeFormatted } from '../utils/parseTimeFormatted'
import delay from 'delay'
import { remindState } from '../store/state.remind'

export const MakeRemind = async (
  context: LineContext,
  props: Props<Client, Event>,
) => {
  const speakingUser = await context.getUserProfile()
  const speakingText: string = context.event.message.text.trim()

  if (speakingUser) {
    const orderArray = speakingText.split(' ')

    if (orderArray.length < 3) {
      await context.sendText('指令不正確，請輸入例如： $提醒我 要記得買水 30m')
      return
    }

    const pendingText = orderArray[orderArray.length - 1]
    const remindText =
      orderArray.pop() &&
      orderArray.reverse() &&
      orderArray.pop() &&
      orderArray.reverse() &&
      orderArray.join(' ')

    if (!/\d+[smh]/i.exec(pendingText)) {
      await context.sendText('日期格式不正確，請輸入例如 3m 30m 1h 3s')
      return
    }

    if (!remindText) {
      return await context.sendText('請問要提醒你什麼？（輸入 $help 查看格式）')
    }

    const { nowTime, remindAt } = parseTimeFormatted(pendingText)

    const delaySecond = Number(remindAt.diff(nowTime).toString())

    await context.sendText(
      `好，我會在 ${remindAt.format('MM月DD hh時mm分ss秒')} 提醒你`,
    )

    delay(delaySecond).finally(async () => {
      await context.pushText(`提醒 @${speakingUser.displayName}：${remindText}`)
    })

    remindState.add(context, {
      remindAt: remindAt.toISOString(),
      remindText,
    })
  }

  return props?.next
}
