import { NewsDoc } from '@/lib/mongodb/models/news'

export interface Crawler {
  crawl(keyword?: string): Promise<NewsDoc[]>
  provider: NewsDoc['provider']
}
