import { NewsDoc } from '@/lib/news/NewsDoc'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { crawlGamer } from '@/lib/news/crawlGamer'
import { crawl4Gamers } from '@/lib/news/crawl4Gamers'

export const newsAPI = {
  crawlAll: async () => {
    await crawlGamer()
    await crawl4Gamers()
  },
  addItems: async (items: NewsDoc[]) => {
    for (const item of items) {
      await firestoreAPI.db
        .collection('news')
        .doc(item._id)
        .set(item)
    }
  },
}
