import mongoose, { Document } from 'mongoose'
import { NewsProvider } from '@/lib/news/NewsProvider'

export interface NewsDoc {
  /** 由 npm:uuid-by-string 生產 */
  newsId: string
  /** ISO8601 format */
  postedAt: string
  title: string
  linkUrl: string
  provider: NewsProvider
  coverUrl: string
  tag: string[]
}

export const NewsSchema = new mongoose.Schema({
  newsId: String,
  coverUrl: String,
  linkUrl: String,
  postedAt: String,
  provider: String,
  title: String,
  tag: [String],
} as { [key in keyof NewsDoc]: any })

export const NewsModel = mongoose.model<Document & NewsDoc>('news', NewsSchema)
