import fetch from 'node-fetch'
import getUuidByString from 'uuid-by-string'
import dayjs from 'dayjs'
import { Crawler } from '@/lib/news/crawlers/Crawler'
import { NewsProvider } from '@/lib/news/NewsProvider'
import { NewsDoc } from '@/lib/mongodb/models/news'

interface Data {
  title: string
  canonicalUrl: string
  urlString: string
  intro: string
  tags: ('魔獸爭霸3' | '魔獸爭霸III淬鍊重生' | '魔獸爭霸' | 'Blizzard')[]
  hit: number
  author: {
    id: number
    nickname: string
  }
  createPublishedAt: number
  smallBannerUrl?: string
  socialBannerUrl?: string
  category: {
    name: string
    activated: boolean
    displayOrder: number
    id: number
  }
  id: number
}

/** 4Gamers */
export class FourGamersCrawler implements Crawler {
  public provider = NewsProvider['4Gamers']

  async crawl(keyword: string) {
    if (!keyword) {
      return []
    }

    return await fetch(
      encodeURI(
        `https://www.4gamers.com.tw/site/api/news/by-tag?tag=${keyword}&nextStart=0&pageSize=25`,
      ),
    )
      .then(res => res.json())
      .then(
        (response: {
          data: {
            results: Data[]
            pager: {}
          }
        }) => {
          return response.data.results.map(item => {
            return {
              _id: getUuidByString(item.title),
              coverUrl:
                item.socialBannerUrl || 'https://i.imgur.com/ow2Ipot.png',
              linkUrl: item.canonicalUrl,
              postedAt: dayjs(item.createPublishedAt).toISOString(),
              provider: this.provider,
              tag: [...item.tags],
              title: item.title,
            } as NewsDoc
          })
        },
      )
  }
}
