import ua, { EventParams } from 'universal-analytics'
import { debugAPI } from '@/lib/debugAPI'
import { omit } from 'lodash'

const visitor = ua(process.env.GOOGLE_ANALYTICS_UA_ID)

interface SendParams extends EventParams {
  ec: EventCategory
  el?: any
}

enum EventCategory {
  API = 'API',
  LINEBOT = 'LINEBOT',
}

export const gaAPI = {
  EventCategory,
  send: (event: SendParams) => {
    const debug = debugAPI.ga.extend(gaAPI.send.name)
    debug(
      `${event.ec}/${event.ea} ${JSON.stringify(omit(event, ['ec', 'ea']))}`,
    )

    process.env.NODE_ENV !== 'production' &&
      visitor
        .event({
          ...omit(event, 'el'),
          el: JSON.stringify(event.el),
        })
        .send()
  },
}
