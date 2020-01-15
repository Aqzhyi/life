import { QueryTwitchStreams } from './Actions/QueryTwitchStreams'
import { LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { QueryTwitchStreamsText } from './constants/texts'
import { i18nAPI } from './lib/i18n/i18nAPI'

export default async function App(context: LineContext): Promise<unknown> {
  await i18nAPI.init()
  return router([text(QueryTwitchStreamsText, QueryTwitchStreams as any)])
}
