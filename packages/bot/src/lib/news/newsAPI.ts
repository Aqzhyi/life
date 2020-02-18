import { debugAPI } from '@/lib/debug/debugAPI'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { FourGamersCrawler } from '@/lib/news/crawlers/FourGamersCrawler'
import dayjs from 'dayjs'
import { GamerCrawler } from '@/lib/news/crawlers/GamerCrawler'
import { GamebaseCrawler } from '@/lib/news/crawlers/GamebaseCrawler'
import { TeslCrawler } from '@/lib/news/crawlers/TeslCrawler'
import { NewsDoc } from '@/lib/mongodb/models/news'

export const newsAPI = {
  installCrawlers: [
    new FourGamersCrawler(),
    new GamerCrawler(),
    new GamebaseCrawler(),
    new TeslCrawler(),
  ],
  crawlAll: async (byKeyword: string) => {
    const container: Promise<any>[] = []

    for (const crawler of newsAPI.installCrawlers) {
      const log = debugAPI.news.extend(crawler.provider)

      log(`開始爬蟲，關鍵字：${byKeyword}`)

      const promise = crawler.crawl(byKeyword).then(data => {
        const news = data.filter(item => !!item._id && !!item.title)

        log(
          `爬文新聞量：${news.length}`,
          news.map(
            item => `${item.title} @${dayjs(item.postedAt).format('MM/DD')}`,
          ),
        )

        return newsAPI.addItems(news)
      })

      container.push(promise)
    }

    await Promise.all(container)
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
      .slice(0, 10)
  },
}
