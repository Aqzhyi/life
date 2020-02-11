import { NewsDoc } from '@/lib/news/NewsDoc'

export interface Crawler {
  crawl(keyword?: string): Promise<NewsDoc[]>
  provider: NewsDoc['provider']
}
