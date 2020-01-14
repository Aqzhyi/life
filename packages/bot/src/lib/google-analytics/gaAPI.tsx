import ua from 'universal-analytics'

export const visitor = ua(process.env.GOOGLE_ANALYTICS_UA_ID)
