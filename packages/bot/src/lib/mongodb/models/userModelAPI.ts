import { UserModel, UserDoc } from '@/lib/mongodb/models/user'
import { debugAPI } from '@/lib/debugAPI'

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
