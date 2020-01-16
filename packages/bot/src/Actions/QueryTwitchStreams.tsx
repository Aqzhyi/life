import { GameID } from '../lib/twitch/enums/GameID'
import { LanguageParam } from '../lib/twitch/enums/LanguageParam'
import { twitchAPI } from '../lib/twitch/twitchAPI'
import { LineContext, LineEvent } from 'bottender'
import { Client, Props } from 'bottender/dist/types'
import { gaAPI } from '../lib/google-analytics/gaAPI'
import ow from 'ow'
import { i18nAPI } from '../lib/i18n/i18nAPI'
import { debugAPI } from '../lib/debug/debugAPI'

const TARGET_GAME_CONFIG = [
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
] as const

type TargetGame = Exclude<typeof TARGET_GAME_CONFIG[number][number], object>

export const QueryTwitchStreams = async (
  context: LineContext,
  props: Props<Client, LineEvent> & {
    match?: { groups?: { targetGame?: TargetGame } }
  },
) => {
  context.sendText(i18nAPI.t('tip/正在查詢'))
  const debug = debugAPI.bot.extend(QueryTwitchStreams.name)
  const defaultsGameId: TargetGame = '魔獸'
  const targetGame = props.match?.groups?.targetGame?.toLowerCase() as
    | TargetGame
    | undefined

  debug(`用戶 input:${targetGame}`)

  let gameId: GameID | undefined
  let gameTitle: string | undefined
  let targetGameDefine: TargetGame[] = []

  for (const gameConfigs of TARGET_GAME_CONFIG) {
    const [gameConfig, ...gameMatchTexts] = gameConfigs
    const foo = new Set(gameMatchTexts)

    if (foo.has(targetGame || defaultsGameId)) {
      gameId = gameConfig.gameId
      gameTitle = gameConfig.text()
    }

    targetGameDefine = [...targetGameDefine, ...gameMatchTexts]
  }

  debug(`系統 targetGameDefine:${targetGameDefine}`)
  debug(`系統 gameId:${gameId} title:${gameTitle}`)

  try {
    targetGame &&
      ow(
        targetGame,
        ow.string.validate(value => ({
          validator: targetGameDefine.includes(value as TargetGame),
          message: i18nAPI.t('validate/支援文字', {
            text: targetGame,
            list: JSON.stringify(targetGameDefine),
          }),
        })),
      )

    try {
      ow(!gameId || !gameTitle, ow.boolean.false)
    } catch (error) {
      gaAPI.send({
        ec: 'linebot',
        ea: `${gameTitle}/查詢/正在直播頻道/錯誤`,
        el: JSON.stringify({
          context: `!gameId || !gameTitle`,
          errorMessage: error.message,
        }),
      })
      await context.sendText(i18nAPI.t('error/系統內部錯誤'))
      return
    }
    if (!gameId || !gameTitle) return

    const user = await context.getUserProfile()

    gaAPI.send({
      ec: 'linebot',
      ea: `${gameTitle}/查詢/正在直播頻道`,
      el: JSON.stringify({
        functionName: QueryTwitchStreams.name,
        userDisplayName: user?.displayName,
        userProfile: user,
      }),
      ev: 10,
    })

    const response = await twitchAPI.getStreams({
      gameId,
      language: LanguageParam.zh,
    })

    const flexContents = response.data
      .sort((left, right) => {
        return right.viewerCount - left.viewerCount
      })
      .map(item => {
        const urlId = /live_user_(.*?)-/i.exec(item.thumbnailUrl)
        return {
          type: 'box',
          layout: 'horizontal',
          margin: 'lg',
          spacing: 'xs',
          contents: [
            {
              type: 'text',
              text: item.title,
              color: '#555555',
              align: 'center',
              gravity: 'center',
              size: 'xs',
              flex: 6,
            },
            {
              type: 'button',
              action: {
                type: 'uri',
                label: urlId?.[1] ? '🔴' : '💥',
                uri: `https://www.twitch.tv/${urlId?.[1]}`,
              },
              flex: 2,
            },
          ],
        }
      })

    await context.sendFlex(`${gameTitle}.查詢.正在直播頻道`, {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${gameTitle}正在直播`,
                weight: 'bold',
                color: '#1DB446',
                size: 'lg',
              },
              {
                type: 'separator',
                margin: 'lg',
              },
              ...(flexContents as any),
              {
                type: 'separator',
                margin: 'lg',
              },
              {
                type: 'text',
                text: '指令 -> $直播 {遊戲:預設魔獸}',
                size: 'xs',
                margin: 'xl',
              },
              {
                type: 'text',
                text: '{遊戲} -> WOW/LOL/COD/OW/魔獸/星海/創世神',
                size: 'xs',
                margin: 'xl',
              },
            ],
          },
        ],
      },
    })

    const sendUsers = response.data.map(item => item.userName).join(',')
    debug(`回應 ${sendUsers}`)
    gaAPI.send({
      ec: 'linebot',
      ea: `${gameTitle}/查詢/正在直播頻道/回應`,
      el: sendUsers,
    })
  } catch (error) {
    debug(`錯誤 ${error.message}`)
    gaAPI.send({
      ec: 'linebot',
      ea: `${gameTitle}/查詢/正在直播頻道/錯誤`,
      el: JSON.stringify({
        errorMessage: error.message,
      }),
    })

    await context.sendText(error.message)
  }

  return props?.next
}
