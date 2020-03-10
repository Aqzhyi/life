import getUuidByString from 'uuid-by-string'
import dayjs from 'dayjs'
import { Crawler } from '@/lib/mongodb/models/news/crawlers/Crawler'
import { NewsProvider } from '@/lib/mongodb/models/news/NewsProvider'
import { NewsDoc } from '@/lib/mongodb/models/news'
import { axiosAPI } from '@/lib/axiosAPI'

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

    return await axiosAPI
      .get<{
        data: {
          results: Data[]
          pager: {}
        }
      }>(
        `https://www.4gamers.com.tw/site/api/news/by-tag?tag=${keyword}&nextStart=0&pageSize=25`,
      )
      .then(response => {
        return response.data.data.results.map(item => {
          return {
            newsId: getUuidByString(item.title),
            coverUrl: item.socialBannerUrl || 'https://i.imgur.com/ow2Ipot.png',
            linkUrl: item.canonicalUrl,
            postedAt: dayjs(item.createPublishedAt).toDate(),
            provider: this.provider,
            tag: [...item.tags],
            title: item.title,
          } as NewsDoc
        })
      })
  }
}
