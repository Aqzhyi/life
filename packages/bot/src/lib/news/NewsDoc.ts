import { NewsProvider } from '@/lib/news/NewsProvider'

export interface NewsDoc {
  /** 由 npm:uuid-by-string 生產 */
  _id: string
  /** ISO8601 format */
  postedAt: string
  title: string
  linkUrl: string
  provider: NewsProvider
  coverUrl: string
  tag: string[]
}
