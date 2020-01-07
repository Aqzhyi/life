import { Action, Client, Event } from 'bottender/dist/types'

export const SayRemindFormat: Action<Client, Event> = async (
  context,
  props,
) => {
  await context.sendText('試試看指令：$提醒我 記得要吸貓 15m')
  return props?.next
}
