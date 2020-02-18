import { LineAction } from '@/lib/bottender-toolkit/types'
import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { chunk } from 'lodash'
import { createCover } from '@/lib/bottender-toolkit/templates/createCover'
import { createMessageSendButton } from '@/lib/bottender-toolkit/templates/createMessageSendButton'
import { showTwitchTopGamesGA } from './ga'

export const showTwitchTopGamesAction: LineAction = async (context, props) => {
  try {
    showTwitchTopGamesGA.onQuery()
    const twitchData = await twitchAPI.getTopGames()
    const data = chunk(twitchData, 10)

    for (const datum of data) {
      context.sendFlex('請選擇要查詢的直播', {
        type: 'carousel',
        contents: [
          ...(datum.map(item => {
            return {
              type: 'bubble',
              size: 'micro',
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
                    size: 'md',
                  },
                  {
                    type: 'text',
                    text: `api.stream.id ${item.id}`,
                    size: 'xxs',
                    color: '#bbbbbb',
                  },
                ],
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  createMessageSendButton({
                    label: '查看',
                    text: `！直播${item.name}`,
                  }),
                ],
              },
            }
          }) as any),
        ],
      })
      showTwitchTopGamesGA.onResponsed(twitchData)
    }
  } catch (error) {
    showTwitchTopGamesGA.onError(error)
    await context.sendText(error.message)
  }

  return props.next
}
