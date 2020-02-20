import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { queryGamePriceGa } from '@/actions/queryGamePrice/ga'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { fetchGamesPrice } from '@/utils/fetchGamesPrice'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'

export const queryGamePriceAction: LineAction<WithGroupProps<{
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
          bubbles: items.map(item => {
            const hasDiscountNow = item.current.discount !== 0

            return createSmallCardBubble({
              coverUrl: item.coverUrl,
              link: item.isthereanydealUrl,
              title: item.title,
              subtitle: `最佳價格 ${item.current.price} 美金`,
              content: [
                `${(hasDiscountNow && '✅折扣中') || '🤔未發現折扣'}`,
                ` `,
                `當前折扣 ${item.current.discount}％`,
                `當前價格 ${item.current.price}美金`,
                ` `,
                `歷史折扣 ${item.historical.discount}％`,
                `歷史價格 ${item.historical.price}美金`,
              ],
            })
          }),
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
