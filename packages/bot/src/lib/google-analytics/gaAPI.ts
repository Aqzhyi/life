import ua, { EventParams } from 'universal-analytics'
import { debugAPI } from '@/lib/debugAPI'
import { omit } from 'lodash'

const visitor = ua(process.env.GOOGLE_ANALYTICS_UA_ID)

export const gaAPI = {
  send: (event: Omit<EventParams, 'el'> & { el?: any }) => {
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
