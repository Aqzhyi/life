import { BottenderAction } from '@/lib/bottender-toolkit/types'
import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { createCover } from '@/lib/bottender-toolkit/templates/createCover'
import { createMessageSendButton } from '@/lib/bottender-toolkit/templates/createMessageSendButton'
import { showTwitchTopGamesGA } from './ga'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'

export const showTwitchTopGamesAction: BottenderAction = async (
  context,
  props,
) => {
  try {
    showTwitchTopGamesGA.onQuery()
    const twitchData = await twitchAPI.getTopGames()

    if (isLineContext(context)) {
      sendFlex(
        context,
        {
          alt: '請選擇要查詢的直播',
          bubbles: twitchData.map(item => {
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
          }),
        },
        { preset: 'LINE_CAROUSEL' },
      )
    }

    showTwitchTopGamesGA.onResponsed(twitchData)
  } catch (error) {
    showTwitchTopGamesGA.onError(error)
    await context.sendText(error.message)
  }

  return props.next
}
