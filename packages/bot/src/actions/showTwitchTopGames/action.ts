import { BottenderAction } from '@/lib/bottender-toolkit/types'
import { twitchAPI } from '@/lib/twitchAPI'
import { createCover } from '@/lib/bottender-toolkit/templates/createCover'
import { showTwitchTopGamesGA } from './ga'
import { isLineContext } from '@/utils/isLineContext'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { twitchThumbnailUrlWith } from '@/utils/twitchThumbnailUrlWith'
import { createText } from '@/lib/line-flex-toolkit/createText'
import { createButton } from '@/lib/line-flex-toolkit/createButton'

export const showTwitchTopGamesAction: BottenderAction = async (
  context,
  props,
) => {
  try {
    showTwitchTopGamesGA.onQuery()
    const twitchData = (await twitchAPI.helix.games.getTopGames()).data

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
                imageUrl: twitchThumbnailUrlWith('640x360', item.boxArtUrl),
              }),
              body: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  createText({
                    text: item.name,
                    size: 'md',
                  }),
                  createText({
                    text: `api.stream.id ${item.id}`,
                    size: 'xxs',
                    color: '#bbbbbb',
                  }),
                ],
              },
              footer: {
                type: 'box',
                layout: 'vertical',
                contents: [
                  createButton({
                    style: 'primary',
                    height: 'sm',
                    action: {
                      type: 'message',
                      label: '查看',
                      text: `！直播${item.name}`,
                    },
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
