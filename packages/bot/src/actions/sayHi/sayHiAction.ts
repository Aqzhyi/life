import { LineAction } from '@/lib/bottender-toolkit/types'
import { showTwitchTopGamesCommandBubble } from '@/actions/showTwitchTopGames/showTwitchTopGamesCommandBubble'
import { queryNewsCommandBubble } from '@/actions/queryNews/queryNewsCommandBubble'
import { queryTwitchStreamsCommandBubble } from '@/actions/queryTwitchStreams/queryTwitchStreamsCommandBubble'
import { sayBullshitCommandBubble } from '@/actions/sayBullshit/sayBullshitCommandBubble'
import { queryGamePriceCommandBubble } from '@/actions/queryGamePrice/commandBubble'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'

export const sayHiAction: LineAction = async (context, props) => {
  const seeLink = {
    type: 'bubble',
    size: 'micro',
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '那個機器人',
          weight: 'bold',
          color: '#1DB446',
          size: 'sm',
        },
        {
          type: 'text',
          text: '關於',
          weight: 'bold',
          size: 'xxl',
          margin: 'md',
        },
        {
          type: 'text',
          text: '如何使用這個機器人',
          size: 'xs',
          color: '#aaaaaa',
          wrap: true,
        },
        {
          type: 'separator',
          margin: 'xxl',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      margin: 'xxl',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          action: {
            type: 'uri',
            label: '查看',
            uri:
              'https://www.notion.so/hilezi/d7ac6acf3ee94029a245be3df3c9f5fe',
          },
        },
      ],
    },
  }

  sendFlex(
    context,
    {
      alt: '機器人操作指令面板',
      bubbles: [
        queryGamePriceCommandBubble(context),
        showTwitchTopGamesCommandBubble(context),
        queryTwitchStreamsCommandBubble(context),
        ...queryNewsCommandBubble(context),
        sayBullshitCommandBubble(context),
        seeLink,
      ],
      text: `指令🧩 \`唬爛{主題}\`
      指令🧩 \`唬爛{主題} {長度}\`
      指令🧩 \`{關鍵字}新聞\`

      其它詳細操作起見[網站](https://www.notion.so/hilezi/LINE-BOT-d7ac6acf3ee94029a245be3df3c9f5fe)`,
    },
    { preset: 'LINE_CAROUSEL' },
  )

  return props.next
}
