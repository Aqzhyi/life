import { GameID } from '../lib/twitch/enums/GameID'
import { i18nAPI } from '../lib/i18n/i18nAPI'

/**
 * 設定哪些遊戲和其關鍵字
 *
 * 目前只支援 Twitch
 */
export const GAME_CONFIGS = [
  [
    { gameId: GameID.minecraft, text: () => i18nAPI.t('game/minecraft') },
    'mc',
    'minecraft',
    '創世神',
    '我的世界',
    '我的創世神',
  ],
  [
    { gameId: GameID.starcraft2, text: () => i18nAPI.t('game/sc2') },
    'sc',
    'sc2',
    '星海',
  ],
  [
    {
      gameId: GameID.callOfDutyModernWarfare,
      text: () => i18nAPI.t('game/cod'),
    },
    'cod',
    '決勝時刻',
    '現代戰爭',
  ],
  [
    { gameId: GameID.leagueOfLegends, text: () => i18nAPI.t('game/lol') },
    'lol',
    '英雄',
    '英雄聯盟',
  ],
  [
    { gameId: GameID.warcraft3, text: () => i18nAPI.t('game/wc3') },
    'wc',
    'wc3',
    '魔獸',
    '魔獸爭霸',
  ],
  [
    { gameId: GameID.worldOfWarcraft, text: () => i18nAPI.t('game/wow') },
    '魔獸世界',
    'wow',
  ],
  [
    { gameId: GameID.overwatch, text: () => i18nAPI.t('game/overwatch') },
    'overwatch',
    'ow',
    '鬥陣',
    '鬥陣特攻',
  ],
  [
    { gameId: GameID.justChatting, text: () => i18nAPI.t('game/chatting') },
    '聊天',
    'chat',
  ],
  [
    {
      gameId: GameID.counterStrikeGlobalOffensive,
      text: () => i18nAPI.t('game/csgo'),
    },
    'cs',
    'csgo',
    'cs:go',
    '絕對武力',
  ],
  [
    {
      gameId: GameID.Hearthstone,
      text: () => i18nAPI.t('game/hearthstone'),
    },
    'hearthstone',
    'hs',
    '爐石',
    '爐石戰記',
  ],
  [
    {
      gameId: GameID.pathOfExile,
      text: () => i18nAPI.t('game/poe'),
    },
    'poe',
    '流亡黯道',
  ],
  [
    {
      gameId: GameID.Dota2,
      text: () => i18nAPI.t('game/dota2'),
    },
    'dota',
    'dota2',
  ],
] as const

/** 用來匹配遊戲的關鍵字 */
export type GameKeyword = Exclude<typeof GAME_CONFIGS[number][number], object>

export const GAME_KEYWORDS: GameKeyword[] = GAME_CONFIGS.reduce(
  (current, item, text) => {
    const [gameConfig, ...gameMatchTexts] = item
    current = [...current, ...gameMatchTexts]
    return current
  },
  [] as GameKeyword[],
)
