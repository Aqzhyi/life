import fetch from 'node-fetch'
import cheerio from 'cheerio'

/**
 * 爬蟲爬取遊戲歷史記錄
 */
export const fetchGamesPrice = async (keyword: string) => {
  return await fetch(
    encodeURI(`https://isthereanydeal.com/search/?q=${keyword}`),
  )
    .then(res => res.text())
    .then(htmlText => {
      type GamePriceItem = {
        current: {
          discount: number
          price: number
        }
        historical: {
          discount: number
          price: number
        }
        isthereanydealUrl: string
        title: string
        coverUrl: string
      }

      const items = (cheerio(htmlText)
        .find('.card-container')
        .map((index, element) => {
          const noDiscount = 0

          const $element = cheerio(element)

          const title = $element.find('.card__title').text()

          const isthereanydealUrl =
            'https://isthereanydeal.com' +
            $element.find('.card__title').attr('href')

          const historicalDiscount = $element
            .find('.numtag__second')
            .eq(0)
            .text()
            ?.replace('%', '')

          const historicalPrice = $element
            .find('.numtag__primary')
            .eq(0)
            .text()
            ?.replace('$', '')

          const currentDiscount = $element
            .find('.numtag__second')
            .eq(1)
            .text()
            ?.replace('%', '')

          const currentPrice = $element
            .find('.numtag__primary')
            .eq(1)
            .text()
            ?.replace('$', '')

          return {
            coverUrl: $element
              .find('.card__img div[data-img-sm]')
              .attr('data-img-sm'),
            current: {
              discount: Number(currentDiscount) || noDiscount,
              price: Number(currentPrice),
            },
            historical: {
              discount: Number(historicalDiscount) || noDiscount,
              price: Number(historicalPrice),
            },
            isthereanydealUrl,
            title,
          } as GamePriceItem
        })
        .toArray() as any[]) as GamePriceItem[]

      return items
    })
}
