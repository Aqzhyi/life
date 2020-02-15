import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import { queryGamePriceGa } from '@/actions/queryGamePrice/ga'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'

const getSearchResult = async (keyword: string) => {
  return await fetch(
    encodeURI(`https://isthereanydeal.com/search/?q=${keyword}`),
  )
    .then(res => res.text())
    .then(htmlText => {
      type Item = {
        current: number
        historical: number
        isthereanydealUrl: string
        title: string
        coverUrl: string
      }

      const items = (cheerio(htmlText)
        .find('.card-container')
        .map((index, element) => {
          const $element = cheerio(element)

          const title = $element.find('.card__title').text()

          const isthereanydealUrl =
            'https://isthereanydeal.com' +
            $element.find('.card__title').attr('href')

          const historical = $element
            .find('.numtag__second')
            .eq(0)
            .text()
            ?.replace('%', '')

          const noDiscount = 0

          const current = $element
            .find('.numtag__second')
            .eq(1)
            .text()
            ?.replace('%', '')

          return {
            coverUrl: $element
              .find('.card__img div[data-img-sm]')
              .attr('data-img-sm'),
            current: Number(current) || noDiscount,
            historical: Number(historical) || noDiscount,
            isthereanydealUrl,
            title,
          } as Item
        })
        .toArray() as any[]) as Item[]

      return items
    })
}

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
    const items = await getSearchResult(keyword)

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
