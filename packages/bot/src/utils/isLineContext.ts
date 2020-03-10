import { LineContext, TelegramContext } from 'bottender'
import { assertsLineContext } from '@/utils/assertsLineContext'

export const isLineContext = (
  context: LineContext | TelegramContext,
): context is LineContext => {
  try {
    assertsLineContext(context)
    return true
  } catch (error) {
    return false
  }
}
