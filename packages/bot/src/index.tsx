import { RemindCommand } from './commands/RemindCommand'
import { RemindHelp } from './commands/RemindHelp'
import { LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { Action, Client, Event } from 'bottender/dist/types'
import { RemindList } from './commands/RemindList'

type DefaultsAction = Action<Client, Event>

export default async function App(context: LineContext): Promise<unknown> {
  return router([
    text(/^[$＄]help/i, RemindHelp),
    text(/^[$＄](提醒我|remind)[\s\S]*$/i, RemindCommand as DefaultsAction),
    text(/^[$＄](我的提醒|list)[\s\S]*$/i, RemindList as DefaultsAction),
  ])
}
