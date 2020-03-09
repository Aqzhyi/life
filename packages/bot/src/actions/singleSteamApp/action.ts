import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { steamAPI } from '@/lib/steamAPI'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { createText } from '@/lib/line-flex-toolkit/createText'
import { createButton } from '@/lib/line-flex-toolkit/createButton'
import { newsAPI } from '@/lib/news/newsAPI'
import dayjs from 'dayjs'

export const singleSteamAppAction: BottenderAction<WithGroupProps<{
  appId: string
}>> = async (context, props) => {
  try {
    const appId = props.match?.groups?.appId
    const steamSubData = await steamAPI.getAppSubData(appId)

    if (!steamSubData) {
      return props.next
    }

    const steamAppLink = `https://store.steampowered.com/app/${appId}`
    const coverUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg?t=${new Date().getTime()}`

    await newsAPI.crawlAll(steamSubData.name)

    const newsBubbles = (
      await newsAPI.getList({ keyword: steamSubData.name, length: 9 })
    ).map(newsDatum =>
      createSmallCardBubble({
        coverUrl: newsDatum.coverUrl,
        title: newsDatum.title,
        link: newsDatum.linkUrl,
        contents: [
          createText({
            text: '@' + dayjs(newsDatum.postedAt).format('YYYY-MM-DD'),
          }),
        ],
      }),
    )

    sendFlex(
      context,
      {
        alt: 'Steam 遊戲',
        bubbles: [
          createSmallCardBubble({
            title: steamSubData.name,
            link: steamAppLink,
            coverUrl,
            contents: [
              createText({
                text: `${steamSubData.price.final / 100} 台幣`,
                size: 'sm',
              }),
            ],
            footerContents: [
              createButton({
                style: 'primary',
                height: 'sm',
                action: {
                  label: '查看 Steam',
                  uri: steamAppLink,
                },
              }),
            ],
          }),
          ...newsBubbles,
        ],
      },
      { preset: 'LINE_CAROUSEL' },
    )
  } catch (error) {
    await context.sendText(error.message)
  }

  return props.next
}
