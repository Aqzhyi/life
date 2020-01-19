import { GAME_KEYWORDS, GameKeyword } from '@/configs/GAME_CONFIGS'
import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { debugAPI } from '@/lib/debug/debugAPI'
import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { GameID } from '@/lib/twitch/enums/GameID'
import { LanguageParam } from '@/lib/twitch/enums/LanguageParam'
import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { twitchGameSelector } from '@/selectors/twitchGameSelector'
import ow from 'ow'
import replaceStrings from 'replace-string'
import { isKeywordSelector } from '@/selectors/isKeywordSelector'
import dayjs from 'dayjs'
import { chunk } from 'lodash'
import { createCoverBubble } from '@/lib/bottender-toolkit/templates/createCoverBubble'
import { EventCategory } from '@/lib/google-analytics/EventCategory'

export const QueryTwitchStreams: LineAction<WithGroupProps<{
  inputKeyword: GameKeyword
}>> = async (context, props) => {
  const debug = debugAPI.bot.extend(QueryTwitchStreams.name)
  const defaultsKeyword: GameKeyword = '魔獸'
  const inputKeyword = props.match?.groups?.inputKeyword?.toLowerCase()

  debug(`用戶 input:${inputKeyword}`)

  let game = twitchGameSelector(inputKeyword as GameKeyword)
  let gameId: GameID | string | undefined = game?.id
  let gameTitle: string | undefined = game?.title

  debug(`系統 GAME_KEYWORDS:${GAME_KEYWORDS}`)
  debug(`系統 gameId:${gameId} gameTitle:${gameTitle}`)

  try {
    if (!gameId) {
      const { data } = await twitchAPI.searchGame(inputKeyword || '')

      if (data[0]?.id) {
        gameId = data[0].id
        gameTitle = gameTitle || data[0].name
        debug(`系統 套用官方搜尋結果`)
        debug(`系統 gameId:${gameId} gameTitle:${gameTitle}`)
      }
    }

    if (!gameId) {
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
        ec: EventCategory.LINEBOT,
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
      ec: EventCategory.LINEBOT,
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
        const coverUrl = replaceStrings(
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

        return createCoverBubble({
          cover: {
            imageUrl: coverUrl,
            linkUrl: siteLink,
          },
          footer: siteLink,
          info: {
            left: viewerCount,
            right: startedAt,
          },
          subTitle: title,
          title: name,
        })
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
        ec: EventCategory.LINEBOT,
        ea: `${gameTitle}/查詢/正在直播頻道/回應`,
        el: sendUsers,
        ev: sendUsers.length,
      })
    } else {
      gaAPI.send({
        ec: EventCategory.LINEBOT,
        ea: `${gameTitle}/查詢/正在直播頻道/無結果`,
        el: gameTitle,
      })
      await context.sendText(`查詢不到 ${gameTitle} 的中文直播頻道`)
    }
  } catch (error) {
    debug(`錯誤 ${error.message}`)
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `${gameTitle}/查詢/正在直播頻道/錯誤`,
      el: JSON.stringify({
        errorMessage: error.message,
      }),
    })

    await context.sendText(error.message)
  }

  return props?.next
}
