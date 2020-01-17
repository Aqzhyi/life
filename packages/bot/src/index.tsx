import { QueryTwitchStreams } from './actions/QueryTwitchStreams'
import { LineContext, chain } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { QueryTwitchStreamsText } from './configs/texts'
import { i18nAPI } from './lib/i18n/i18nAPI'
import { RecordUserSaying } from './actions/RecordUserSaying'
import { SayHelloWorld } from './actions/SayHelloWorld'

export default async function App(context: LineContext): Promise<unknown> {
  await i18nAPI.init()

  return router([
    text(QueryTwitchStreamsText, QueryTwitchStreams as any),
    text(
      /^[!！$＄](?<text>[\s\S]+)/i,
      chain([RecordUserSaying as any, SayHelloWorld]),
    ),
  ])
}
