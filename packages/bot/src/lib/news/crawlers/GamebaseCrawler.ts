import { Crawler } from '@/lib/news/crawlers/Crawler'
import { NewsProvider } from '@/lib/news/NewsProvider'
import fetch from 'node-fetch'
import getUuidByString from 'uuid-by-string'
import { NewsDoc } from '@/lib/mongodb/models/news'

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
 * Gamebase
 */
export class GamebaseCrawler implements Crawler {
  provider = NewsProvider.Gamebase

  async crawl(keyword: string) {
    if (!keyword) {
      return []
    }

    return await fetch(
      encodeURI(`https://www.gamebase.com.tw/news/search/${keyword}`),
    )
      .then(res => res.text())
      .then<NewsDoc[]>(htmlText => {
        const items = eval(
          /<script type="application\/ld\+json">(?<items>[\s\S]+?)<\/script>/i.exec(
            htmlText,
          )?.groups?.items || '',
        ) as PrintedData[]

        return items.map<NewsDoc>(item => ({
          newsId: getUuidByString(item.headline),
          title: item.headline,
          coverUrl: item.image.url,
          linkUrl: item.mainEntityOfPage['@id'],
          postedAt: item.datePublished,
          provider: this.provider,
          tag: [keyword],
        }))
      })
  }
}
