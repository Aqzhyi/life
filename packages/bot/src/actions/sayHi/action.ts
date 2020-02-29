import { BottenderAction } from '@/lib/bottender-toolkit/types'
import { showTwitchTopGamesCommandBubble } from '@/actions/showTwitchTopGames/commandBubble'
import { queryNewsCommandBubble } from '@/actions/queryNews/commandBubble'
import { queryTwitchStreamsCommandBubble } from '@/actions/queryTwitchStreams/commandBubble'
import { sayBullshitCommandBubble } from '@/actions/sayBullshit/commandBubble'
import { queryGamePriceCommandBubble } from '@/actions/queryGamePrice/commandBubble'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { isTelegramContext } from '@/lib/bottender-toolkit/utils/isTelegramContext'
import { replaceStringTabSpace } from '@/utils/replaceStringTabSpace'
import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const sayHiAction: BottenderAction = async (context, props) => {
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

  if (isLineContext(context)) {
    sendFlex(
      context,
      {
        alt: '機器人操作指令面板',
        bubbles: [
          createCommandHintBubble({
            commandLabel: '{Steam 願望單網址}',
            commandDescription: '查詢 Steam 願望單遊戲價格',
            commandText:
              '!https://store.steampowered.com/wishlist/id/hipigg/#sort=order',
            context,
          }),
          queryGamePriceCommandBubble(context),
          showTwitchTopGamesCommandBubble(context),
          queryTwitchStreamsCommandBubble(context),
          ...queryNewsCommandBubble(context),
          sayBullshitCommandBubble(context),
          seeLink,
        ],
      },
      { preset: 'LINE_CAROUSEL' },
    )
  }

  if (isTelegramContext(context)) {
    context.sendMessage(
      replaceStringTabSpace(`指令🧩 \`唬爛{主題}\`
    指令🧩 \`唬爛{主題} {長度}\`
    指令🧩 \`新聞{關鍵字}\`

    其它詳細操作起見[網站](https://www.notion.so/hilezi/LINE-BOT-d7ac6acf3ee94029a245be3df3c9f5fe)`),
    )
  }

  return props.next
}
