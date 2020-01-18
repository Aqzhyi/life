import ua, { EventParams } from 'universal-analytics'
import { debugAPI } from '@/lib/debug/debugAPI'

const visitor = ua(process.env.GOOGLE_ANALYTICS_UA_ID)

export const gaAPI = {
  send: (event: EventParams) => {
    const debug = debugAPI.ga.extend(gaAPI.send.name)
    debug(`${JSON.stringify(event)}`)

    visitor.event(event).send()
  },
}
