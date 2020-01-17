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

export const QueryTwitchStreams: LineAction<WithGroupProps<{
  inputKeyword: GameKeyword
}>> = async (context, props) => {
  context.sendText(i18nAPI.t('tip/正在查詢'))
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
          validator: GAME_KEYWORDS.includes(value as GameKeyword),
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
                color: '#999999',
                type: 'text',
                text: '指令: $直播{遊戲中或英名稱}',
                size: 'xs',
                margin: 'xl',
              },
              {
                color: '#999999',
                type: 'text',
                text: '例如: $直播聊天、$直播魔獸、$直播LOL',
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
