import fetch from 'node-fetch'
import { NewsDoc } from '@/lib/news/NewsDoc'
import getUuidByString from 'uuid-by-string'
import { debugAPI } from '@/lib/debug/debugAPI'
import { newsAPI } from '@/lib/news/newsAPI'
import dayjs from 'dayjs'
import cheerio from 'cheerio'

interface PrintedData {
  mainEntityOfPage: {
    /** 新聞連結 e.g. `'https://www.gamebase.com.tw/news/topic/99219890/'` */
    '@id': 'https://www.gamebase.com.tw/news/topic/99219890/'
  }
  /** 新聞標題 e.g. `'《魔獸爭霸 3》重製版新資訊曝光！索爾、泰蘭妲及多個單位高畫質遊戲模組亮相'` */
  headline: string
  image: {
    url: string
    width: 200
    height: 112
  }
  /** ISO8601 格式 e.g. `'2019-08-06T04:51:09+08:00'` */
  datePublished: string
  /** ISO8601 格式 e.g. `'2019-08-06T04:51:09+08:00'` */
  dateModified: string
  description: string
}

/**
 * 爬取 Gamebase 相關新聞
 */
export const crawlGamebase = async (byKeyword: string) => {
  const log = debugAPI.news.extend('Gamebase')

  log('爬文 關鍵字=', byKeyword)

  const news = await fetch(
    encodeURI(`https://www.gamebase.com.tw/news/search/${byKeyword}`),
  )
    .then(res => res.text())
    .then<NewsDoc[]>(htmlText => {
      const items = eval(
        /<script type="application\/ld\+json">(?<items>[\s\S]+?)<\/script>/i.exec(
          htmlText,
        )?.groups?.items || '',
      ) as PrintedData[]

      return items.map<NewsDoc>(item => ({
        _id: getUuidByString(item.headline),
        title: item.headline,
        coverUrl: item.image.url,
        linkUrl: item.mainEntityOfPage['@id'],
        postedAt: item.datePublished,
        provider: 'Gamebase',
        tag: [byKeyword],
      }))
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
