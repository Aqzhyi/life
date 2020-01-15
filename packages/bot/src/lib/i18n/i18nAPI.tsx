import i18next from 'i18next'

const resources: {
  [key in 'tw' | 'en']: {
    translation: Partial<{
      'game/wc3': string
      'game/sc2': string
      'validate/支援文字': string
    }>
  }
} = {
  tw: {
    translation: {
      'game/sc2': '星海爭霸2',
      'game/wc3': '魔獸爭霸3',
      'validate/支援文字':
        '輸入的後輟「{{text}}」不在支援列表之中，必須是 {{- list}} 的其中一項',
    },
  },
  en: {
    translation: {
      'game/sc2': 'StarCraft II',
      'game/wc3': 'WarCraft III',
    },
  },
}

type I18nKeys = keyof typeof resources['tw']['translation']

export const i18nAPI = {
  init: () => {
    return i18next.init({
      lng: 'tw',
      fallbackLng: ['tw', 'en'],
      debug: process.env.NODE_ENV !== 'production',
      resources,
    })
  },
  t: (key: I18nKeys, options?: any) => {
    return i18next.t(key, options)
  },
}
