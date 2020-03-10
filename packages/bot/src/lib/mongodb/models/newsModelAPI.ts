import { debugAPI } from '@/lib/debugAPI'
import { FourGamersCrawler } from '@/lib/mongodb/models/news/crawlers/FourGamersCrawler'
import dayjs from 'dayjs'
import { GamerCrawler } from '@/lib/mongodb/models/news/crawlers/GamerCrawler'
import { GamebaseCrawler } from '@/lib/mongodb/models/news/crawlers/GamebaseCrawler'
import { TeslCrawler } from '@/lib/mongodb/models/news/crawlers/TeslCrawler'
import { NewsDoc, NewsModel } from '@/lib/mongodb/models/news'

export const newsModelAPI = {
  installCrawlers: [
    new FourGamersCrawler(),
    new GamerCrawler(),
    new GamebaseCrawler(),
    new TeslCrawler(),
  ],
  crawlAll: async (byKeyword: string) => {
    const container: Promise<any>[] = []

    for (const crawler of newsModelAPI.installCrawlers) {
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

        return newsModelAPI.addItems(news)
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
  getList: async (options: {
    /** 關鍵字，用來搜尋 title 和 tags */
    keyword: string
    /** 取回長度，預設 1 */
    length?: number
  }) => {
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

    return data.slice(0, options.length ?? 10)
  },
}
