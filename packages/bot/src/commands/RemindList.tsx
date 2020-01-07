import { LineContext, Context } from 'bottender'
import { Props, Client, Event } from 'bottender/dist/types'
import { remindState } from '../store/remindState'

export const RemindList = (
  context: LineContext,
  props: Props<Client, Event>,
) => {
  context.sendText(JSON.stringify(remindState.list(context)))
  return props?.next
}
