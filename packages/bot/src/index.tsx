import { MakeRemind } from './Actions/RemindCommand'
import { SayRemindFormat } from './Actions/RemindHelp'
import { LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { Action, Client, Event } from 'bottender/dist/types'
import { SayRemindList } from './Actions/RemindList'

type DefaultsAction = Action<Client, Event>

export default async function App(context: LineContext): Promise<unknown> {
  return router([
    text(/^[$＄]help/i, SayRemindFormat),
    text(/^[$＄](提醒我|remind)[\s\S]*$/i, MakeRemind as DefaultsAction),
    text(/^[$＄](我的提醒|list)[\s\S]*$/i, SayRemindList as DefaultsAction),
  ])
}
