import { debugAPI } from '@/lib/debug/debugAPI'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { FourGamersCrawler } from '@/lib/news/crawlers/FourGamersCrawler'
import { NewsDoc } from '@/lib/news/NewsDoc'
import dayjs from 'dayjs'
import { GamerCrawler } from '@/lib/news/crawlers/GamerCrawler'
import { GamebaseCrawler } from '@/lib/news/crawlers/GamebaseCrawler'
import { TeslCrawler } from '@/lib/news/crawlers/TeslCrawler'

export const newsAPI = {
  installCrawlers: [
    new FourGamersCrawler(),
    new GamerCrawler(),
    new GamebaseCrawler(),
    new TeslCrawler(),
  ],
  crawlAll: async (byKeyword: string) => {
    for (const crawler of newsAPI.installCrawlers) {
      const log = debugAPI.news.extend(crawler.provider)

      log(`開始爬蟲，關鍵字：${byKeyword}`)

      const news = (await crawler.crawl(byKeyword)).filter(
        item => !!item._id && !!item.title,
      )

      log(
        `爬文新聞量：${news.length}`,
        news.map(
          item => `${item.title} @${dayjs(item.postedAt).format('MM/DD')}`,
        ),
      )

      await newsAPI.addItems(news)
    }
  },
  addItems: async (items: NewsDoc[]) => {
    for (const item of items) {
      await firestoreAPI.db
        .collection('news')
        .doc(item._id)
        .set(item)
    }
  },
  getList: async (options: { keyword: string; pageCount: number }) => {
    const data1 = (
      await firestoreAPI.db
        .collection('news')
        .orderBy('postedAt', 'desc')
        .limit(300)
        .get()
    ).docs.map(item => item.data() as NewsDoc)

    return data1
      .filter(
        item =>
          item.title.includes(options.keyword) ||
          item.tag.filter(tag => tag.includes(options.keyword)).length,
      )
      .slice(0, 9)
  },
}