import { Crawler } from '@/lib/news/crawlers/Crawler'
import { NewsProvider } from '@/lib/news/NewsProvider'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import fetch from 'node-fetch'
import getUuidByString from 'uuid-by-string'
import { NewsDoc } from '@/lib/mongodb/models/news'

/** 巴哈姆特 */
export class GamerCrawler implements Crawler {
  public provider = NewsProvider.巴哈姆特

  async crawl(keyword: string) {
    return await fetch(
      encodeURI(`https://acg.gamer.com.tw/search.php?s=4&kw=${keyword}`),
    )
      .then(res => res.text())
      .then(htmlText => {
        return (cheerio(htmlText)
          .find('p.search_title')
          .map((index, element) => {
            const linkUrl = cheerio(element)
              .find('a[target=_blank]')
              .attr('href')

            const title = cheerio(element)
              .find('a[target=_blank]')
              .text()

            const newsId = getUuidByString(title)

            return {
              newsId,
              provider: '巴哈姆特',
              title: cheerio(element)
                .find('a[target=_blank]')
                .text()
                .trim(),
              linkUrl: linkUrl?.startsWith('//') ? `https:${linkUrl}` : linkUrl,
              postedAt: dayjs(
                cheerio(element)
                  .siblings('div')
                  .find('p')
                  .text()
                  .trim(),
              ).toISOString(),
              coverUrl: 'https://i.imgur.com/ow2Ipot.png',
              tag: [keyword],
            } as NewsDoc
          })
          .toArray() as any) as NewsDoc[]
      })
  }
}
