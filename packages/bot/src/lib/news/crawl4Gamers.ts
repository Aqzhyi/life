import fetch from 'node-fetch'
import { NewsDoc } from '@/lib/news/NewsDoc'
import getUuidByString from 'uuid-by-string'
import { debugAPI } from '@/lib/debug/debugAPI'
import { newsAPI } from '@/lib/news/newsAPI'
import dayjs from 'dayjs'

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

/**
 * 爬取 4Gamers 關於魔獸爭霸的新聞
 */
export const crawl4Gamers = async (byKeyword: string) => {
  const log = debugAPI.news.extend('4Gamers')

  log('爬文 關鍵字=', byKeyword)

  const news = await fetch(
    encodeURI(
      `https://www.4gamers.com.tw/site/api/news/by-tag?tag=${byKeyword}&nextStart=0&pageSize=25`,
    ),
  )
    .then(res => res.json())
    .then<NewsDoc[]>(
      (response: {
        data: {
          results: Data[]
          pager: {}
        }
      }) => {
        return response.data.results.map(item => {
          return {
            _id: getUuidByString(item.title),
            provider: '4Gamers',
            title: item.title,
            linkUrl: item.canonicalUrl,
            postedAt: dayjs(item.createPublishedAt).toISOString(),
            coverUrl: item.socialBannerUrl || 'https://i.imgur.com/ow2Ipot.png',
            tag: [byKeyword, ...item.tags],
          } as NewsDoc
        })
      },
    )

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
