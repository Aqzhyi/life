import mongoose, { Document } from 'mongoose'
import { debugAPI } from '@/lib/debugAPI'

export interface UserDoc {
  lastActive: Date
  userName: {
    line?: string
    telegram?: string
  }
  userId?: {
    line?: string
    telegram?: string
  }
  steamWishlistUrl?: string
}

export const UserSchema = new mongoose.Schema({
  lastActive: Date,
  userName: {
    line: String,
    telegram: String,
  },
  userId: {
    line: String,
    telegram: String,
  },
  steamWishlistUrl: String,
})

export const UserModel = mongoose.model<Document & UserDoc>('user', UserSchema)
