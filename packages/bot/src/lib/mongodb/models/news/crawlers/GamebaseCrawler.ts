import { Crawler } from '@/lib/mongodb/models/news/crawlers/Crawler'
import { NewsProvider } from '@/lib/mongodb/models/news/NewsProvider'
import getUuidByString from 'uuid-by-string'
import { NewsDoc } from '@/lib/mongodb/models/news'
import { axiosAPI } from '@/lib/axiosAPI'

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

    let htmlText: string
    try {
      htmlText = (
        await axiosAPI.get<string>(
          `https://www.gamebase.com.tw/news/search/${keyword}`,
          { timeout: 3000 },
        )
      ).data
    } catch (error) {
      return []
    }

    const items =
      (eval(
        /<script type="application\/ld\+json">(?<items>[\s\S]+?)<\/script>/i.exec(
          htmlText,
        )?.groups?.items || '',
      ) as PrintedData[] | null) || []

    return items.map<NewsDoc>(item => ({
      newsId: getUuidByString(item.headline),
      title: item.headline,
      coverUrl: item.image.url,
      linkUrl: item.mainEntityOfPage['@id'],
      postedAt: new Date(item.datePublished),
      provider: this.provider,
      tag: [],
    }))
  }
}
