import { GAME_KEYWORDS, GameKeyword } from '@/configs/GAME_CONFIGS'
import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { debugAPI } from '@/lib/debug/debugAPI'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { GameID } from '@/lib/twitch/enums/GameID'
import { LanguageParam } from '@/lib/twitch/enums/LanguageParam'
import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { twitchGameSelector } from '@/selectors/twitchGameSelector'
import ow from 'ow'
import { isKeywordSelector } from '@/selectors/isKeywordSelector'
import { chunk } from 'lodash'
import { createStreamInfoBubble } from '@/lib/bottender-toolkit/templates/createCoverBubble'
import { streamModelSelector } from '@/selectors/streamModelSelector'
import { useQueryTwitchStreamGa } from '@/lib/google-analytics/events/queryTwitchStreamGa'

export const QueryTwitchStreams: LineAction<WithGroupProps<{
  inputKeyword: GameKeyword
}>> = async (context, props) => {
  const debug = debugAPI.bot.extend(QueryTwitchStreams.name)
  const debugSystem = debug.extend('系統')
  const debugUser = debug.extend('用戶')
  const defaultsKeyword: GameKeyword = '魔獸'
  const inputKeyword = props.match?.groups?.inputKeyword?.toLowerCase()
  const queryTwitchStreamGa = useQueryTwitchStreamGa(context)

  debugUser(`輸入:${inputKeyword}`)

  const game = twitchGameSelector(inputKeyword as GameKeyword)
  let gameId: GameID | string | undefined = game?.id
  let gameTitle: string | undefined = game?.title

  debugSystem(`GAME_KEYWORDS:${GAME_KEYWORDS}`)
  debugSystem(`gameId:${gameId} gameTitle:${gameTitle}`)

  try {
    if (!gameId && inputKeyword) {
      const data = await twitchAPI.helix.games.getGameByName(inputKeyword)

      if (data?.id) {
        gameId = data.id
        gameTitle = gameTitle || data.name
        debugSystem(`套用官方搜尋結果`)
        debugSystem(`gameId:${gameId} gameTitle:${gameTitle}`)
      }
    }

    if (!gameId && inputKeyword) {
      await context.sendText(
        i18nAPI.t['validate/支援文字']({ text: inputKeyword }),
      )
      return
    }

    try {
      ow(!gameId || !gameTitle, ow.boolean.false)
    } catch (error) {
      queryTwitchStreamGa.onError({
        gameTitle: inputKeyword || '',
        context: `!gameId || !gameTitle`,
        errorMessage: error.message,
      })
      await context.sendText(i18nAPI.t['error/系統內部錯誤']())
      return
    }
    if (!gameId || !gameTitle) return

    queryTwitchStreamGa.onQuery(gameTitle || inputKeyword || '')

    const { data } = await twitchAPI.helix.streams.getStreams({
      game: gameId,
      language: LanguageParam.zh,
    })

    const flexContents = data
      .sort((left, right) => {
        return right.viewers - left.viewers
      })
      .map(streamModelSelector)
      .map(
        item =>
          item &&
          createStreamInfoBubble({
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
          }),
      )
      .filter(item => typeof item === 'object')

    const splittedContents = chunk(flexContents, 10)

    if (splittedContents.length) {
      for (const contents of splittedContents) {
        await context.sendFlex(`${gameTitle}/查詢/正在直播頻道`, {
          type: 'carousel',
          contents: [...(contents as any)],
        })
      }

      queryTwitchStreamGa.onSentStreams(gameTitle || inputKeyword || '', data)
    } else {
      queryTwitchStreamGa.onNoResult(gameTitle || inputKeyword || '')
      await context.sendText(`查詢不到 ${gameTitle} 的中文直播頻道`)
    }
  } catch (error) {
    queryTwitchStreamGa.onError({
      gameTitle: gameTitle || inputKeyword || '',
      context: `inputKeyword=${inputKeyword}`,
      errorMessage: error.message,
    })
    await context.sendText(error.message)
  }

  return props?.next
}
