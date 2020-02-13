import { Crawler } from '@/lib/news/crawlers/Crawler'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { NewsProvider } from '@/lib/news/NewsProvider'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import fetch from 'node-fetch'
import getUuidByString from 'uuid-by-string'

/** TESL */
export class TeslCrawler implements Crawler {
  public provider = NewsProvider.TESL

  public async crawl(keyword: string) {
    let news: NewsDoc[] = []

    for (const currentPage of [1, 2, 3]) {
      for (const url of [
        'http://www.esports.com.tw/edcontent.php?lang=tw&tb=2&cid=52&currentpage=', // 遊戲新聞
        'http://www.esports.com.tw/edcontent.php?lang=tw&tb=2&cid=36&currentpage=', // 電競新聞
      ]) {
        const crawledNews = await fetch(encodeURI(`${url}=${currentPage}`))
          .then(res => res.text())
          .then(htmlText => {
            return (cheerio(htmlText)
              .find('.row.item')
              .map((index, element) => {
                const linkUrl =
                  cheerio(element)
                    .find('a')
                    .attr('href') || ''

                const title =
                  cheerio(element)
                    .find('a')
                    .attr('title') || ''

                const _id = getUuidByString(title)

                return {
                  _id,
                  coverUrl: cheerio(element)
                    .find('.img-responsive')
                    .attr('src'),
                  linkUrl: `http://esports.com.tw/${linkUrl}`,
                  postedAt: dayjs(
                    cheerio(element)
                      .find('.listdate')
                      .text()
                      .trim()
                      .replace(/\n/, '/'),
                  ).toISOString(),
                  provider: this.provider,
                  tag: [],
                  title: title.trim(),
                } as NewsDoc
              })
              .toArray() as any) as NewsDoc[]
          })
        news = [...news, ...crawledNews]
      }
    }

    return news
      .filter(item => item.title.includes(keyword))
      .map(item => ({
        ...item,
        tag: [keyword],
      }))
  }
}
