import { TelegramContext, LineContext } from 'bottender'
import { assertsTelegramContext } from '@/lib/bottender-toolkit/utils/assertsTelegramContext'

export const isTelegramContext = (
  context: LineContext | TelegramContext,
): context is TelegramContext => {
  try {
    assertsTelegramContext(context)
    return true
  } catch (error) {
    return false
  }
}
