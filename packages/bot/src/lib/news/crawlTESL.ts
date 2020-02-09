import fetch from 'node-fetch'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import getUuidByString from 'uuid-by-string'
import { debugAPI } from '@/lib/debug/debugAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { newsAPI } from '@/lib/news/newsAPI'

/**
 * 爬取 TESL 的新聞
 */
export const crawlTESL = async () => {
  const log = debugAPI.news.extend('TESL')

  log('爬文')

  const promises = [1, 2, 3].map(async currentPage => {
    ;[
      'http://www.esports.com.tw/edcontent.php?lang=tw&tb=2&cid=52&currentpage=', // 遊戲新聞
      'http://www.esports.com.tw/edcontent.php?lang=tw&tb=2&cid=36&currentpage=', // 電競新聞
    ].map(async url => {
      const news = await fetch(encodeURI(`${url}=${currentPage}`))
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
                provider: 'TESL',
                title: title.trim(),
                linkUrl: `http://esports.com.tw/${linkUrl}`,
                postedAt: dayjs(
                  cheerio(element)
                    .find('.listdate')
                    .text()
                    .trim()
                    .replace(/\n/, '/'),
                ).toISOString(),
                coverUrl: cheerio(element)
                  .find('.img-responsive')
                  .attr('src'),
                tag: [],
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
    })
  })

  return await Promise.all(promises)
}
