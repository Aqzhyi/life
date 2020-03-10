import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { axiosAPI } from '@/lib/axiosAPI'

/**
 * 爬蟲爬取遊戲的價格記錄（含歷史折扣與台灣價格）
 */
export const fetchGamesPrice = async (keyword: string) => {
  // 主要拿 appId 和 title
  type SteamDataV1 = {
    appId: string
    steamLinkUrl: string
    title: string
  }

  const steamSearchResult = await axiosAPI
    .get<string>(
      `https://store.steampowered.com/search/results?term=${keyword}`,
    )
    .then(({ data: htmlText }) => {
      const $items = cheerio(htmlText).find('#search_resultsRows a')

      return ($items
        .map((index, element) => {
          const title = cheerio(element)
            .find('.title')
            .text()
            .trim()

          const appId = cheerio(element).attr('data-ds-appid') as string
          const steamLinkUrl = cheerio(element).attr('href') as string

          return {
            appId,
            steamLinkUrl,
            title,
          } as SteamDataV1
        })
        .toArray() as any) as SteamDataV1[]
    })

  // 主要拿 coverUrl 和 歷史折扣
  type IsThereAnyDealData = {
    historical: {
      discount: number
      price: number
    }
    isthereanydealUrl: string
    title: string
    coverUrl: string
  }

  const isThereAnyDealData = await axiosAPI
    .get<string>(`https://isthereanydeal.com/search/?q=${keyword}`)
    .then(({ data: htmlText }) => {
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

          return {
            coverUrl: $element
              .find('.card__img div[data-img-sm]')
              .attr('data-img-sm'),
            historical: {
              discount: Number(historicalDiscount) || noDiscount,
              price: Number(historicalPrice),
            },
            isthereanydealUrl,
            title,
          } as IsThereAnyDealData
        })
        .toArray() as any[]) as IsThereAnyDealData[]

      return items
    })

  // 主要拿 subId
  interface SteamDataV2 extends SteamDataV1 {
    subId: string
  }

  const steamData = await Promise.all(
    steamSearchResult.map(item =>
      axiosAPI
        .get<string>(`https://store.steampowered.com/app/${item.appId}`)
        .then(({ data: htmlText }) => {
          const subId = cheerio(htmlText)
            .find('[name="subid"]')
            .attr('value') as string

          return { ...item, subId } as SteamDataV2
        }),
    ),
  )

  // 主要拿台灣價格
  interface SteamDataV3 extends SteamDataV2 {
    price: {
      initial: number
      final: number
    }
  }

  const steamPriceData = await Promise.all(
    steamData.map(item => {
      if (!item.subId) {
        return null
      }
      return axiosAPI
        .get(
          `https://store.steampowered.com/api/packagedetails/?packageids=${item.subId}&cc=tw`,
        )
        .then(({ data: jsonData }) => {
          const datum = jsonData[item.subId]?.data
          if (datum) {
            return {
              ...item,
              price: {
                final: datum.price.final / 100,
                initial: datum.price.initial / 100,
              },
            } as SteamDataV3
          }

          return null
        })
    }),
  )

  // 用來拼湊最後要輸出的資訊
  interface SteamData extends SteamDataV3, IsThereAnyDealData {}

  return steamPriceData
    .map(item => {
      const isThereAnyDealDatum = isThereAnyDealData.find(
        datum => datum.title === item?.title,
      )
      if (isThereAnyDealDatum) {
        return { ...item, ...isThereAnyDealDatum } as SteamData
      }

      return null
    })
    .filter(Boolean) as SteamData[]
}
