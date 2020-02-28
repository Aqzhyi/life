import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { queryGamePriceGa } from '@/actions/queryGamePrice/ga'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { fetchGamesPrice } from '@/utils/fetchGamesPrice'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { createText } from '@/lib/line-flex-toolkit/createText'
import {
  FlexSize,
  FlexButtonStyle,
  FlexMargin,
  FlexHeight,
} from '@/lib/line-flex-toolkit/enums'
import { createButton } from '@/lib/line-flex-toolkit/createButton'

export const queryGamePriceAction: BottenderAction<WithGroupProps<{
  inputKeyword?: string
}>> = async (context, props) => {
  const keyword = props.match?.groups?.inputKeyword?.trim()

  queryGamePriceGa.onQuery(keyword || '__EMPTY__')

  if (!keyword) {
    await context.sendText(
      '💥 請輸入 steam 關鍵字，例如「遊戲售價部落与弯刀」或「遊戲售價billion」',
    )
    return
  }

  try {
    const items = await fetchGamesPrice(keyword)

    if (items.length) {
      await sendFlex(
        context,
        {
          alt: '遊戲售價/查詢',
          bubbles: [
            ...items.map(item => {
              const hasDiscountNow = item.price.final < item.price.initial

              return createSmallCardBubble({
                coverUrl: item.coverUrl,
                link: item.steamLinkUrl,
                title: item.title,
                contents: [
                  createText({
                    text: `${(hasDiscountNow && '✅折扣中') || '🤔未發現折扣'}`,
                  }),
                  createText({
                    text: `價格 ${item.price.final} 台幣`,
                  }),
                  createText({
                    size: FlexSize.sm,
                    color: '#999999',
                    text: `歷史折扣 ${item.historical.discount}％`,
                  }),
                  createText({
                    size: FlexSize.sm,
                    color: '#999999',
                    text: `歷史價格 ${item.historical.price}美金`,
                  }),
                  createText({
                    size: FlexSize.sm,
                    color: '#cccccc',
                    text: `提供者 IsThereAnyDeal`,
                  }),
                ],
                footerContents: [
                  createButton({
                    style: FlexButtonStyle.primary,
                    height: FlexHeight.sm,
                    action: {
                      uri: item.steamLinkUrl,
                      label: '查看',
                    },
                  }),
                ],
              })
            }),
            createSmallCardBubble({
              title: 'Chrome 擴充程式推薦',
              link: 'https://es.isthereanydeal.com/',
              contents: [
                createText({
                  text: '協助你在 steam 網站上直接查詢歷史價格',
                  wrap: true,
                }),
              ],
              footerContents: [
                createButton({
                  style: FlexButtonStyle.primary,
                  height: FlexHeight.sm,
                  action: {
                    uri: 'https://es.isthereanydeal.com/',
                    label: '查看',
                  },
                }),
              ],
              coverUrl: 'https://es.isthereanydeal.com/img/logo.png?1549755893',
            }),
          ],
        },
        { preset: 'LINE_CAROUSEL' },
      )
    } else {
      await context.sendText(
        '找不到遊戲售價，用該遊戲的英文譯名或簡體字試試看？',
      )
    }

    queryGamePriceGa.onResponse(keyword)
  } catch (error) {
    queryGamePriceGa.onError(keyword, error)
    await context.sendText(error.message)
  }
}
