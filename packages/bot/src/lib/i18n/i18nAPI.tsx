import { en } from './en'
import { tw } from './tw'
import { I18nKey } from '@/lib/i18n/I18nKey'
import i18next from 'i18next'

const resources: {
  [key in 'tw' | 'en']: {
    translation: Partial<{ [key in I18nKey]: string }>
  }
} = {
  tw: { translation: tw },
  en: { translation: en },
}

const t = {
  'error/系統內部錯誤': () => i18next.t('error/系統內部錯誤'),
  'game/chatting': () => i18next.t('game/chatting'),
  'game/cod': () => i18next.t('game/cod'),
  'game/csgo': () => i18next.t('game/csgo'),
  'game/dota2': () => i18next.t('game/dota2'),
  'game/hearthstone': () => i18next.t('game/hearthstone'),
  'game/lol': () => i18next.t('game/lol'),
  'game/minecraft': () => i18next.t('game/minecraft'),
  'game/overwatch': () => i18next.t('game/overwatch'),
  'game/poe': () => i18next.t('game/poe'),
  'game/sc2': () => i18next.t('game/sc2'),
  'game/terraria': () => i18next.t('game/terraria'),
  'game/wc3': () => i18next.t('game/wc3'),
  'game/wow': () => i18next.t('game/wow'),
  'text/觀看人數': (values: { value: string | number }) =>
    i18next.t('text/開播時間', values),
  'text/開播時間': (values: { value: string }) =>
    i18next.t('text/開播時間', values),
  'tip/正在查詢': () => i18next.t('tip/正在查詢'),
  'validate/支援文字': (values: { text: string }) =>
    i18next.t('validate/支援文字', values),
} as const

export const i18nAPI = {
  init: () => {
    return i18next.init({
      lng: 'tw',
      fallbackLng: ['tw', 'en'],
      debug: process.env.DEBUG_I18N === '1',
      resources,
    })
  },
  t: t,
}
