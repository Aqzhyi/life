import mongoose, { Document } from 'mongoose'
import { NewsProvider } from '@/lib/mongodb/models/news/NewsProvider'

export interface NewsDoc {
  /** 由 npm:uuid-by-string 生產 */
  newsId: string
  postedAt: Date
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
  postedAt: Date,
  provider: String,
  title: String,
  tag: [String],
} as { [key in keyof NewsDoc]: any })

export const NewsModel = mongoose.model<Document & NewsDoc>('news', NewsSchema)
