import { GameID } from '../lib/twitch/enums/GameID'
import { LanguageParam } from '../lib/twitch/enums/LanguageParam'
import { twitchAPI } from '../lib/twitch/twitchAPI'
import { LineContext, LineEvent } from 'bottender'
import { Client, Props } from 'bottender/dist/types'
import { visitor } from '../lib/google-analytics/gaAPI'

export const QueryWar3rStreams = async (
  context: LineContext,
  props: Props<Client, LineEvent>,
) => {
  try {
    const user = await context.getUserProfile()
    visitor
      .event({
        ec: 'linebot',
        ea: '查詢.魔獸爭霸3.正在直播頻道',
        el: JSON.stringify({
          functionName: QueryWar3rStreams.name,
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
            },
            {
              type: 'button',
              action: {
                type: 'uri',
                label: '直播中',
                uri: `https://www.twitch.tv/${item.userName}`,
              },
            },
          ],
        }
      })

    await context.sendFlex('Warcraft III Streams', {
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
