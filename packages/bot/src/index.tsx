import { RemindCommand } from './commands/RemindCommand'
import { RemindHelp } from './commands/RemindHelp'
import { LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { Action, Client, Event } from 'bottender/dist/types'

type DefaultsAction = Action<Client, Event>

export default async function App(context: LineContext): Promise<unknown> {
  return router([
    text(/^[$＄]help/i, RemindHelp),
    text(/^[$＄]提醒我[\s\S]*$/i, RemindCommand as DefaultsAction),
    text(/^[$＄]remind[\s\S]*$/i, RemindCommand as DefaultsAction),
  ])
}
