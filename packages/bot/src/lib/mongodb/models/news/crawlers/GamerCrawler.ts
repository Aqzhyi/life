import { Crawler } from '@/lib/mongodb/models/news/crawlers/Crawler'
import { NewsProvider } from '@/lib/mongodb/models/news/NewsProvider'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import getUuidByString from 'uuid-by-string'
import { NewsDoc } from '@/lib/mongodb/models/news'
import { axiosAPI } from '@/lib/axiosAPI'

/** 巴哈姆特 */
export class GamerCrawler implements Crawler {
  public provider = NewsProvider.巴哈姆特

  async crawl(keyword: string) {
    return await axiosAPI
      .get<string>(`https://acg.gamer.com.tw/search.php?s=4&kw=${keyword}`)
      .then(({ data: htmlText }) => {
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
              ).toDate(),
              coverUrl: 'https://i.imgur.com/ow2Ipot.png',
              tag: [keyword],
            } as NewsDoc
          })
          .toArray() as any) as NewsDoc[]
      })
  }
}
