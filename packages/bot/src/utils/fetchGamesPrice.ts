import fetch from 'node-fetch'

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
          } as GamePriceItem
        })
        .toArray() as any[]) as GamePriceItem[]

      return items
    })
}
