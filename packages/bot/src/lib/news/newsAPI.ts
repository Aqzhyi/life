import { debugAPI } from '@/lib/debug/debugAPI'
import { FourGamersCrawler } from '@/lib/news/crawlers/FourGamersCrawler'
import dayjs from 'dayjs'
import { GamerCrawler } from '@/lib/news/crawlers/GamerCrawler'
import { GamebaseCrawler } from '@/lib/news/crawlers/GamebaseCrawler'
import { TeslCrawler } from '@/lib/news/crawlers/TeslCrawler'
import { NewsDoc, NewsModel } from '@/lib/mongodb/models/news'

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
        const news = data.filter(item => !!item.newsId && !!item.title)

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
    let count = 0
    for (const item of items) {
      const data = await NewsModel.findOne({
        newsId: item.newsId,
      })

      if (!data) {
        const doc = new NewsModel(item)
        await doc.save()
        count++
      }
    }

    debugAPI.mongoDB(
      `傳入了 ${items.length} NewsDoc，小計新增了 ${count} 個 NewsDoc`,
    )
  },
  getList: async (options: { keyword: string }) => {
    const data1 = await NewsModel.find({
      title: new RegExp(`${options.keyword}`, 'i'),
    })

    const data2 = await NewsModel.find({
      tag: {
        $in: new RegExp(`${options.keyword}`, 'i'),
      },
    })

    const data = [...data1, ...data2].sort(
      (left, right) =>
        dayjs(right.postedAt)
          .toDate()
          .getTime() -
        dayjs(left.postedAt)
          .toDate()
          .getTime(),
    )

    return data.slice(0, 10)
  },
}
