import originalAxios from 'axios'
import { decamelizeKeys, camelizeKeys } from 'humps'
import { gaAPI } from '@/lib/gaAPI'

export const axiosAPI = originalAxios.create({
  headers: {},
  responseType: 'json',
})

axiosAPI.interceptors.request.use(config => {
  config.params = decamelizeKeys(config.params)
  return config
})

axiosAPI.interceptors.response.use(response => {
  response.data = camelizeKeys(response.data)

  const isStartsWithHTTP = response.config.url?.startsWith('http')

  gaAPI.send({
    ec: gaAPI.EventCategory.API,
    ea: `使用/AXIOS${(isStartsWithHTTP && `/${response.config.url}`) ||
      response.config.url}`,
  })

  if (response.status >= 400 && response.status < 500) {
    gaAPI.send({
      ec: gaAPI.EventCategory.API,
      ea: '使用/AXIOS/前端錯誤',
      el: {
        url: response.config.url,
        params: response.config.params,
      },
    })
  }

  if (response.status >= 500) {
    gaAPI.send({
      ec: gaAPI.EventCategory.API,
      ea: '使用/AXIOS/後端錯誤',
      el: {
        url: response.config.url,
        params: response.config.params,
      },
    })
  }

  return response
})
