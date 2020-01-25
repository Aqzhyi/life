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
  'error/系統內部錯誤': () => i18next.t(t['error/系統內部錯誤'].name),
  'game/chatting': () => i18next.t(t['game/chatting'].name),
  'game/cod': () => i18next.t(t['game/cod'].name),
  'game/csgo': () => i18next.t(t['game/csgo'].name),
  'game/dota2': () => i18next.t(t['game/dota2'].name),
  'game/hearthstone': () => i18next.t(t['game/hearthstone'].name),
  'game/lol': () => i18next.t(t['game/lol'].name),
  'game/minecraft': () => i18next.t(t['game/minecraft'].name),
  'game/overwatch': () => i18next.t(t['game/overwatch'].name),
  'game/poe': () => i18next.t(t['game/poe'].name),
  'game/sc2': () => i18next.t(t['game/sc2'].name),
  'game/terraria': () => i18next.t(t['game/terraria'].name),
  'game/wc3': () => i18next.t(t['game/wc3'].name),
  'game/wow': () => i18next.t(t['game/wow'].name),
  'text/觀看人數': (values: { value: string | number }) =>
    i18next.t(t['text/觀看人數'].name, values),
  'text/開播時間': (values: { value: string }) =>
    i18next.t(t['text/開播時間'].name, values),
  'tip/正在查詢': () => i18next.t(t['tip/正在查詢'].name),
  'validate/支援文字': (values: { text: string }) =>
    i18next.t(t['validate/支援文字'].name, values),
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
