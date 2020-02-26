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
import { createSeparator } from '@/lib/line-flex-toolkit/createSeparator'

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
              const hasDiscountNow = item.current.discount !== 0

              return createSmallCardBubble({
                coverUrl: item.coverUrl,
                link: item.isthereanydealUrl,
                title: item.title,
                subtitle: `最佳價格 ${item.current.price} 美金`,
                contents: [
                  createText({
                    text: `${(hasDiscountNow && '✅折扣中') || '🤔未發現折扣'}`,
                  }),
                  (item.steam.price &&
                    createText({
                      text: `Steam ${item.steam.price} 台幣`,
                      size: FlexSize.sm,
                    })) ||
                    null,
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
                ],
                footerContents: [
                  createButton({
                    style: FlexButtonStyle.primary,
                    height: FlexHeight.sm,
                    action: {
                      uri: item.isthereanydealUrl,
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
