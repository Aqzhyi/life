import { GameID } from '../lib/twitch/enums/GameID'
import { LanguageParam } from '../lib/twitch/enums/LanguageParam'
import { twitchAPI } from '../lib/twitch/twitchAPI'
import { LineContext, LineEvent } from 'bottender'
import { Client, Props } from 'bottender/dist/types'
import { visitor } from '../lib/google-analytics/gaAPI'

export const QueryTwitchStreams = async (
  context: LineContext,
  props: Props<Client, LineEvent>,
) => {
  const game = new Map([['魔獸', []]])

  try {
    const user = await context.getUserProfile()
    visitor
      .event({
        ec: 'linebot',
        ea: '魔獸爭霸3.查詢.正在直播頻道',
        el: JSON.stringify({
          functionName: QueryTwitchStreams.name,
          userDisplayName: user?.displayName,
          userProfile: user,
        }),
        ev: 10,
      })
      .send()

    const response = await twitchAPI.getStreams({
      gameId: GameID.warcraft3,
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
          margin: 'xs',
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

    await context.sendFlex('查詢.魔獸爭霸3.正在直播頻道', {
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
                text: '魔獸爭霸3正在直播',
                weight: 'bold',
                color: '#1DB446',
                size: 'sm',
              },
              {
                type: 'separator',
                margin: 'sm',
              },
              ...(flexContents as any),
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
