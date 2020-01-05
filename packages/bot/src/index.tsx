import { chain, LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'
import day, { UnitType } from 'dayjs'
import delay from 'delay'
import { Action, Client, Event, Props } from 'bottender/dist/types'

type DefaultsAction = Action<Client, Event>

const parseTimeFormatted = (inputString: string) => {
  const pending = [
    (/\d+/i.exec(inputString) || [])[0],
    (/[smh]/i.exec(inputString) || [])[0],
  ] as [string, UnitType]

  const nowTime = day()
  const remindAtTime = day().add(Number(pending[0]), pending[1])

  return {
    nowTime,
    remindAtTime,
  }
}

const SayRemindFormatHelpCommand: Action<Client, Event> = async (
  context,
  props,
) => {
  await context.sendText('試試看指令：$提醒我 記得要吸貓 15m')
  return props?.next
}

const RemindCommand = async (
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

    const { nowTime, remindAtTime } = parseTimeFormatted(pendingText)

    const delaySecond = Number(remindAtTime.diff(nowTime).toString())

    await context.sendText(
      `好，我會在 ${remindAtTime.format('MM月DD hh時mm分ss秒')} 提醒你`,
    )

    await delay(delaySecond).finally(async () => {
      await context.pushText(`提醒 @${speakingUser.displayName}：${remindText}`)
    })
  }

  return props?.next
}

export default async function App(context: LineContext): Promise<unknown> {
  return router([
    text(/help/, SayRemindFormatHelpCommand),
    text(/^[$＄]提醒我[\s\S]*$/i, RemindCommand as DefaultsAction),
  ])
}
