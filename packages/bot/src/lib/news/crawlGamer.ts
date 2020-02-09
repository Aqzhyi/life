import fetch from 'node-fetch'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import getUuidByString from 'uuid-by-string'
import { debugAPI } from '@/lib/debug/debugAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { newsAPI } from '@/lib/news/newsAPI'

/**
 * 爬取巴哈姆特關於魔獸爭霸的新聞
 */
export const crawlGamer = async (byKeyword: string) => {
  const log = debugAPI.news.extend('巴哈姆特')

  log('爬文 關鍵字=', byKeyword)

  const news = await fetch(
    encodeURI(`https://acg.gamer.com.tw/search.php?s=4&kw=${byKeyword}`),
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

          const _id = getUuidByString(title)

          return {
            _id,
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
            tag: [byKeyword],
          } as NewsDoc
        })
        .toArray() as any) as NewsDoc[]
    })

  news.forEach(item => {
    if (!item.title || !item._id) {
      throw new Error('爬文出錯，找不到標題，請檢查爬蟲')
    }
  })

  log(
    '爬文完成注入DB 原始新聞量',
    news.length,
    news.map(item => `${item.postedAt} ${item.title}`),
  )

  return newsAPI.addItems(news)
}
