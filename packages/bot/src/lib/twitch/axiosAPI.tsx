import originalAxios from 'axios'
import { decamelizeKeys, camelizeKeys } from 'humps'
import ow from 'ow'
import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

ow(process.env.TWITCH_CLIENT_ID, ow.string.nonEmpty)

export const axiosAPI = originalAxios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    ['Client-Id']: process.env.TWITCH_CLIENT_ID,
  },
  responseType: 'json',
})

axiosAPI.interceptors.request.use(config => {
  config.params = decamelizeKeys(config.params)
  return config
})

axiosAPI.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)

  gaAPI.send({
    ec: EventCategory.API,
    ea: `使用/twitch${response.config.url}`,
    el: JSON.stringify({
      config: response.config,
    }),
  })

  if (response.status >= 400 && response.status < 500) {
    gaAPI.send({
      ec: EventCategory.API,
      ea: 'twitch/前端錯誤',
      el: JSON.stringify({
        config: response.config,
      }),
    })
  }

  if (response.status >= 500) {
    gaAPI.send({
      ec: EventCategory.API,
      ea: 'twitch/後端錯誤',
      el: JSON.stringify({
        config: response.config,
      }),
    })
  }

  return response
})
