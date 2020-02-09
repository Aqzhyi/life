import { NewsDoc } from '@/lib/news/NewsDoc'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { crawlGamer } from '@/lib/news/crawlGamer'
import { crawl4Gamers } from '@/lib/news/crawl4Gamers'
import dayjs from 'dayjs'

export const newsAPI = {
  crawlAll: async (byKeyword: string) => {
    await crawlGamer(byKeyword)
    await crawl4Gamers(byKeyword)
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
        .startAt(options.keyword)
        .limit(options.pageCount ?? 10)
        .get()
    ).docs.map(item => item.data() as NewsDoc)

    return data1
  },
}
