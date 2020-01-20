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
import { isKeywordSelector } from '@/selectors/isKeywordSelector'
import { chunk } from 'lodash'
import { createCoverBubble } from '@/lib/bottender-toolkit/templates/createCoverBubble'
import { EventCategory } from '@/lib/google-analytics/EventCategory'
import { streamModelSelector } from '@/selectors/streamModelSelector'

export const QueryTwitchStreams: LineAction<WithGroupProps<{
  inputKeyword: GameKeyword
}>> = async (context, props) => {
  const debug = debugAPI.bot.extend(QueryTwitchStreams.name)
  const debugSystem = debug.extend('系統')
  const debugUser = debug.extend('用戶')
  const defaultsKeyword: GameKeyword = '魔獸'
  const inputKeyword = props.match?.groups?.inputKeyword?.toLowerCase()

  debugUser(`輸入:${inputKeyword}`)

  let game = twitchGameSelector(inputKeyword as GameKeyword)
  let gameId: GameID | string | undefined = game?.id
  let gameTitle: string | undefined = game?.title

  debugSystem(`GAME_KEYWORDS:${GAME_KEYWORDS}`)
  debugSystem(`gameId:${gameId} gameTitle:${gameTitle}`)

  try {
    if (!gameId) {
      const { data } = await twitchAPI.searchGame(inputKeyword || '')

      if (data[0]?.id) {
        gameId = data[0].id
        gameTitle = gameTitle || data[0].name
        debugSystem(`套用官方搜尋結果`)
        debugSystem(`gameId:${gameId} gameTitle:${gameTitle}`)
      }
    }

    if (!gameId) {
      game = twitchGameSelector(defaultsKeyword)
      gameId = game?.id
      gameTitle = game?.title
      debugSystem('套用預設關鍵字')
      debugSystem(`gameId:${gameId} gameTitle:${gameTitle}`)
    }

    try {
      ow(!gameId || !gameTitle, ow.boolean.false)
    } catch (error) {
      gaAPI.send({
        ec: EventCategory.LINEBOT,
        ea: `${gameTitle}/查詢/正在直播頻道/錯誤`,
        el: {
          context: `!gameId || !gameTitle`,
          errorMessage: error.message,
        },
      })
      await context.sendText(i18nAPI.t('error/系統內部錯誤'))
      return
    }
    if (!gameId || !gameTitle) return

    const user = await context.getUserProfile()

    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `${gameTitle}/查詢/正在直播頻道`,
      el: {
        functionName: QueryTwitchStreams.name,
        displayName: user?.displayName,
        statusMessage: user?.statusMessage,
      },
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
      .map(streamModelSelector)
      .map(
        item =>
          item &&
          createCoverBubble({
            cover: {
              imageUrl: item.coverUrl,
              linkUrl: item.siteLink,
            },
            subTitle: item.title,
            title: item.name,
            info: {
              left: item.viewerCount,
              right: item.startedAt,
            },
            footer: item.siteLink,
          }),
      )
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
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: `${inputKeyword}/查詢/正在直播頻道/錯誤`,
      el: {
        errorMessage: error.message,
        inputKeyword,
      },
    })

    await context.sendText(error.message)
  }

  return props?.next
}
