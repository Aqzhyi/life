import { GAME_KEYWORDS, GameKeyword } from '../configs/GAME_CONFIGS'
import { LineAction, WithGroupProps } from '../lib/bottender-toolkit/types'
import { debugAPI } from '../lib/debug/debugAPI'
import { gaAPI } from '../lib/google-analytics/gaAPI'
import { i18nAPI } from '../lib/i18n/i18nAPI'
import { GameID } from '../lib/twitch/enums/GameID'
import { LanguageParam } from '../lib/twitch/enums/LanguageParam'
import { twitchAPI } from '../lib/twitch/twitchAPI'
import { twitchGameSelector } from '../selectors/twitchGameSelector'
import ow from 'ow'
import replaceStrings from 'replace-string'
import { isKeywordSelector } from '../selectors/isKeywordSelector'
import dayjs from 'dayjs'
import { chunk } from 'lodash'

export const QueryTwitchStreams: LineAction<WithGroupProps<{
  inputKeyword: GameKeyword
}>> = async (context, props) => {
  const debug = debugAPI.bot.extend(QueryTwitchStreams.name)
  const defaultsKeyword: GameKeyword = '魔獸'
  const inputKeyword = props.match?.groups?.inputKeyword?.toLowerCase() as
    | GameKeyword
    | undefined

  debug(`用戶 input:${inputKeyword}`)

  let game = twitchGameSelector(inputKeyword!)
  let gameId: GameID | undefined = game?.id
  let gameTitle: string | undefined = game?.title

  debug(`系統 GAME_KEYWORDS:${GAME_KEYWORDS}`)
  debug(`系統 gameId:${gameId} gameTitle:${gameTitle}`)

  try {
    inputKeyword &&
      ow(
        inputKeyword,
        ow.string.validate(value => ({
          validator: isKeywordSelector(value),
          message: i18nAPI.t('validate/支援文字', {
            text: inputKeyword,
            list: replaceStrings(JSON.stringify(GAME_KEYWORDS), '"', ' '),
          }),
        })),
      )

    if (!inputKeyword) {
      game = twitchGameSelector(defaultsKeyword)
      gameId = game?.id
      gameTitle = game?.title
      debug('系統 fallback 預設關鍵字')
      debug(`系統 gameId:${gameId} gameTitle:${gameTitle}`)
    }

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
        displayName: user?.displayName,
        statusMessage: user?.statusMessage,
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
        const urlId = /live_user_(.*?)-/i.exec(item.thumbnailUrl)?.[1]

        if (!urlId) {
          return
        }

        const siteLink = `https://www.twitch.tv/${urlId}`
        const cover = replaceStrings(
          replaceStrings(item.thumbnailUrl, '{width}', '640'),
          '{height}',
          '360',
        )
        const name = item.userName
        const title = item.title
        const viewerCount = i18nAPI.t('text/觀看人數', {
          value: item.viewerCount,
        })
        const startedAt = i18nAPI.t('text/開播時間', {
          value: dayjs(item.startedAt).format('HH:mm'),
        })

        return {
          type: 'bubble',
          header: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: name,
                size: 'xxl',
              },
              {
                type: 'text',
                text: title,
                size: 'xs',
                color: '#999999',
              },
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: viewerCount,
                    size: 'sm',
                    color: '#bbbbbb',
                  },
                  {
                    type: 'text',
                    text: startedAt,
                    size: 'sm',
                    color: '#bbbbbb',
                  },
                ],
              },
              {
                type: 'separator',
                margin: 'xxl',
                color: '#cccccc',
              },
            ],
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: cover,
                size: 'full',
                aspectRatio: '16:9',
                aspectMode: 'cover',
              },
            ],
            action: {
              type: 'uri',
              label: 'action',
              uri: siteLink,
            },
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: siteLink,
                color: '#bbbbbb',
              },
            ],
          },
        }
      })
      .filter(item => typeof item === 'object')

    const splittedContents = chunk(flexContents, 10)

    if (splittedContents.length) {
      for (const contents of splittedContents) {
        await context.sendFlex(`${gameTitle}.查詢.正在直播頻道`, {
          type: 'carousel',
          contents: [...(contents as any)],
        })
      }

      const sendUsers = response.data.map(item => item.userName).join(',')
      debug(`回應 ${sendUsers}`)
      gaAPI.send({
        ec: 'linebot',
        ea: `${gameTitle}/查詢/正在直播頻道/回應`,
        el: sendUsers,
        ev: sendUsers.length,
      })
    } else {
      gaAPI.send({
        ec: 'linebot',
        ea: `${gameTitle}/查詢/正在直播頻道/無結果`,
        el: gameTitle,
      })
      await context.sendText(`查詢不到 ${gameTitle} 的中文直播頻道`)
    }
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
