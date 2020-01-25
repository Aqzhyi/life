import { LineAction } from '@/lib/bottender-toolkit/types'
import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { createStreamInfoBubble } from '@/lib/bottender-toolkit/templates/createCoverBubble'
import { chunk } from 'lodash'
import { createCover } from '@/lib/bottender-toolkit/templates/createCover'
import { twitchUserStreamLink } from '@/selectors/twitchUserStreamLink'
import { createMessageSendButton } from '@/lib/bottender-toolkit/templates/createMessageSendButton'

export const ShowTwitchTopGamesButton: LineAction = async (context, props) => {
  try {
    const data = chunk(await twitchAPI.getTopGames(), 10)

    for (const datum of data) {
      context.sendFlex('請選擇要查詢的直播', {
        type: 'carousel',
        contents: [
          ...(datum.map(item => {
            return {
              type: 'bubble',
              hero: createCover({
                imageUrl: item.coverUrl,
              }),
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: item.name,
                    size: 'xxl',
                  },
                  {
                    type: 'text',
                    text: `api.stream.id ${item.id}`,
                    size: 'xs',
                    color: '#bbbbbb',
                  },
                ],
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  createMessageSendButton({
                    label: '查看正在直播',
                    text: `！直播${item.name}`,
                  }),
                ],
              },
            }
          }) as any),
        ],
      })
    }
  } catch (error) {
    await context.sendText(error.message)
  }

  return props.next
}
