import originalAxios from 'axios'
import { decamelizeKeys, camelizeKeys } from 'humps'
import ow from 'ow'
import { gaAPI } from '@/lib/gaAPI'
import { omit } from 'lodash'

ow(process.env.TWITCH_CLIENT_ID, ow.string.nonEmpty)

const CLIENT_ID_KEY = 'Client-Id'
const AUTHORIZATION_KEY = 'Authorization'

export const steamAxiosAPI = originalAxios.create({
  baseURL: 'https://api.twitch.tv/helix',
  headers: {
    [CLIENT_ID_KEY]: process.env.TWITCH_CLIENT_ID,
  },
  responseType: 'json',
})

steamAxiosAPI.interceptors.request.use(config => {
  config.params = decamelizeKeys(config.params)
  return config
})

steamAxiosAPI.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)

  const headers = omit(response.config.headers, [
    CLIENT_ID_KEY,
    AUTHORIZATION_KEY,
  ])

  const config = {
    ...response.config,
    headers,
  }

  const isStartsWithHTTP = response.config.url?.startsWith('http')

  gaAPI.send({
    ec: gaAPI.EventCategory.API,
    ea: `使用/twitch${(isStartsWithHTTP && `/${response.config.url}`) ||
      response.config.url}`,
    el: {
      config,
    },
  })

  if (response.status >= 400 && response.status < 500) {
    gaAPI.send({
      ec: gaAPI.EventCategory.API,
      ea: 'twitch/前端錯誤',
      el: {
        config,
      },
    })
  }

  if (response.status >= 500) {
    gaAPI.send({
      ec: gaAPI.EventCategory.API,
      ea: 'twitch/後端錯誤',
      el: {
        config,
      },
    })
  }

  return response
})
