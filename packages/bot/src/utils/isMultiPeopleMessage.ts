import { Context } from 'bottender'
import { isLineContext } from '@/utils/isLineContext'
import { debugAPI } from '@/lib/debugAPI'

export const isMultiPeopleMessage = (context: Context<any, any>): boolean => {
  if (isLineContext(context)) {
    return ['group', 'room'].includes(context?.event?.source?.type)
  }

  debugAPI.bot.extend('isMultiPeopleMessage(...) 暫時只支持 LineContext')
  return false
}
