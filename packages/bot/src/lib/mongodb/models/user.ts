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

const log = debugAPI.user.extend('LINE')

export const userModelAPI = {
  async updateLastActive(id: string) {
    const user = (await UserModel.updateOne(
      {
        userId: {
          line: id,
        },
      },
      {
        lastActive: new Date(),
      },
    )) as UserDoc | null

    if (user) {
      log('更新使用者最後活動時間，成功')
    } else {
      log('更新使用者最後活動時間，失敗')
    }

    return user
  },
  async newLineUser(user: Omit<UserDoc, 'lastActive'>) {
    const data: UserDoc = {
      ...user,
      lastActive: new Date(),
    }

    const target = await new UserModel(data).save()

    log('新建使用者', target)

    return target
  },
  async getByLineId(id: string) {
    const user = await UserModel.findOne({
      userId: {
        line: id,
      },
    })

    log(`透過 ID=${id} 尋找使用者，找到`, user)

    return user
  },
}
