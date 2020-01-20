import { LineContext } from 'bottender'
import { LINE_USER } from '../configs/LINE_USER'

export const isOwner = async (context: LineContext) => {
  const user = await context.getUserProfile()
  return user?.userId === LINE_USER.甜豬
}
