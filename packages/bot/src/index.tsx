import { QueryTwitchStreams } from './Actions/QueryTwitchStreams'
import { LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { QueryTwitchStreamsText } from './constants/texts'

export default async function App(context: LineContext): Promise<unknown> {
  return router([text(QueryTwitchStreamsText, QueryTwitchStreams as any)])
}
