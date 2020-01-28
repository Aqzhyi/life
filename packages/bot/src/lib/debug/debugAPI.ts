import debug from 'debug'

const root = debug('w3r')

export const debugAPI = {
  bot: root.extend('bot'),
  ga: root.extend('ga'),
  news: root.extend('news'),
}
