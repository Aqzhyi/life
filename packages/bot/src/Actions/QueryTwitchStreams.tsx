import { GameID } from '../lib/twitch/enums/GameID'
import { LanguageParam } from '../lib/twitch/enums/LanguageParam'
import { twitchAPI } from '../lib/twitch/twitchAPI'
import { LineContext, LineEvent } from 'bottender'
import { Client, Props } from 'bottender/dist/types'
import { visitor } from '../lib/google-analytics/gaAPI'
import ow from 'ow'
import { i18nAPI } from '../lib/i18n/i18nAPI'

const defineTargetGame = ['魔獸', 'wc3', '星海', 'sc2'] as const
type TargetGame = typeof defineTargetGame[number]

export const QueryTwitchStreams = async (
  context: LineContext,
  props: Props<Client, LineEvent> & {
    match?: { groups?: { targetGame?: TargetGame } }
  },
) => {
  const defaultsGameId: TargetGame = '魔獸'
  const targetGame = props.match?.groups?.targetGame

  const gameId = new Map<TargetGame, GameID>([
    ['魔獸', GameID.warcraft3],
    ['wc3', GameID.warcraft3],
    ['星海', GameID.starcraft2],
    ['sc2', GameID.starcraft2],
  ]).get(targetGame || defaultsGameId)!

  const gameTitle = new Map([
    ['魔獸', i18nAPI.t('game/wc3')],
    ['wc3', i18nAPI.t('game/wc3')],
    ['星海', i18nAPI.t('game/sc2')],
    ['sc2', i18nAPI.t('game/sc2')],
  ]).get(targetGame || defaultsGameId)!

  try {
    targetGame &&
      ow(
        targetGame,
        ow.string.validate(value => ({
          validator: defineTargetGame.includes(value as TargetGame),
          message: i18nAPI.t('validate/支援文字', {
            text: targetGame,
            list: JSON.stringify(defineTargetGame),
          }),
        })),
      )

    const user = await context.getUserProfile()
    visitor
      .event({
        ec: 'linebot',
        ea: `${gameTitle}/查詢/正在直播頻道`,
        el: JSON.stringify({
          functionName: QueryTwitchStreams.name,
          userDisplayName: user?.displayName,
          userProfile: user,
        }),
        ev: 10,
      })
      .send()

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
                text: '指令 -> $直播 {魔獸/星海/預設:魔獸}',
                size: 'xs',
                margin: 'xl',
              },
            ],
          },
        ],
      },
    })
  } catch (error) {
    await context.sendText(error.message)
  }

  return props?.next
}
