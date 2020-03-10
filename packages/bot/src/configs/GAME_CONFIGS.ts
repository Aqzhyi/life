import { TwitchGameId } from '@/enums/TwitchGameId'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { expectType } from '@/utils/expectType'

/**
 * 設定哪些遊戲和其關鍵字
 *
 * 目前只支援 Twitch
 */
export const GAME_CONFIGS = [
  [
    {
      gameId: TwitchGameId.minecraft,
      text: () => i18nAPI.t['game/minecraft'](),
    },
    'mc',
    'minecraft',
    '創世神',
    '我的世界',
    '我的創世神',
    '麥塊',
  ],
  [
    { gameId: TwitchGameId.starcraft2, text: () => i18nAPI.t['game/sc2']() },
    'sc',
    'sc2',
    '星海',
  ],
  [
    {
      gameId: TwitchGameId.callOfDutyModernWarfare,
      text: () => i18nAPI.t['game/cod'](),
    },
    'cod',
    '決勝時刻',
    '現代戰爭',
  ],
  [
    {
      gameId: TwitchGameId.leagueOfLegends,
      text: () => i18nAPI.t['game/lol'](),
    },
    'lol',
    '英雄',
    '英雄聯盟',
  ],
  [
    { gameId: TwitchGameId.warcraft3, text: () => i18nAPI.t['game/wc3']() },
    'wc',
    'wc3',
    '魔獸',
    '魔獸爭霸',
  ],
  [
    {
      gameId: TwitchGameId.worldOfWarcraft,
      text: () => i18nAPI.t['game/wow'](),
    },
    '魔獸世界',
    'wow',
  ],
  [
    {
      gameId: TwitchGameId.overwatch,
      text: () => i18nAPI.t['game/overwatch'](),
    },
    'overwatch',
    'ow',
    '鬥陣',
    '鬥陣特攻',
  ],
  [
    {
      gameId: TwitchGameId.justChatting,
      text: () => i18nAPI.t['game/chatting'](),
    },
    '聊天',
    'chat',
  ],
  [
    {
      gameId: TwitchGameId.counterStrikeGlobalOffensive,
      text: () => i18nAPI.t['game/csgo'](),
    },
    'cs',
    'csgo',
    'cs:go',
    '絕對武力',
  ],
  [
    {
      gameId: TwitchGameId.Hearthstone,
      text: () => i18nAPI.t['game/hearthstone'](),
    },
    'hearthstone',
    'hs',
    '爐石',
    '爐石戰記',
  ],
  [
    {
      gameId: TwitchGameId.pathOfExile,
      text: () => i18nAPI.t['game/poe'](),
    },
    'poe',
    '流亡黯道',
  ],
  [
    {
      gameId: TwitchGameId.Dota2,
      text: () => i18nAPI.t['game/dota2'](),
    },
    'dota',
    'dota2',
  ],
  [
    {
      gameId: TwitchGameId.terraria,
      text: () => i18nAPI.t['game/terraria'](),
    },
    'terraria',
    '泰拉瑞亞',
  ],
] as const

/** 用來匹配遊戲的關鍵字 */
export type GameKeyword = Exclude<typeof GAME_CONFIGS[number][number], object>

// 測試 type GameKeyword 必須是遊戲關鍵字
expectType<GameKeyword[]>([
  '魔獸爭霸',
  'lol',
  '英雄聯盟',
  '鬥陣特攻',
  '魔獸世界',
  'wow',
])

export const GAME_KEYWORDS: GameKeyword[] = GAME_CONFIGS.reduce(
  (current, item, text) => {
    const [gameConfig, ...gameMatchTexts] = item
    current = [...current, ...gameMatchTexts]
    return current
  },
  [] as GameKeyword[],
)
