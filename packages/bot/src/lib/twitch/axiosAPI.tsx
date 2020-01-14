import originalAxios from 'axios'
import { decamelizeKeys, camelizeKeys } from 'humps'
import ow from 'ow'

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
  return response
})
