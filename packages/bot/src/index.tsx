import { QueryWar3rStreams } from './Actions/QueryWar3rStreams'
import { LineContext } from 'bottender'
import { router, text } from 'bottender/dist/router'

export default async function App(context: LineContext): Promise<unknown> {
  return router([text(/^[$＄](直播|live)/i, QueryWar3rStreams as any)])
}
