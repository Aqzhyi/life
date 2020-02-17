import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { queryGamePriceGa } from '@/actions/queryGamePrice/ga'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { fetchGamesPrice } from '@/utils/fetchGamesPrice'

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
      await context.sendFlex('遊戲售價/查詢', {
        type: 'carousel',
        contents: [
          ...items.slice(0, 10).map(item =>
            createSmallCardBubble({
              coverUrl: item.coverUrl,
              link: item.isthereanydealUrl,
              title: item.title,
              subtitle:
                item.current !== 0 && item.current === item.historical
                  ? '👍 最佳購買時機'
                  : '可以再等等看看折扣',
              content: [
                `當前折扣 ${item.current}％`,
                `歷史折扣 ${item.historical}％`,
              ],
            }),
          ),
        ] as any,
      })
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
