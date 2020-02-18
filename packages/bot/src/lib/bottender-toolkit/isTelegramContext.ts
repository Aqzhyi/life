import { TelegramContext, LineContext } from 'bottender'

export const isTelegramContext = (
  context: LineContext | TelegramContext,
): context is TelegramContext => {
  if (context.event.message && 'from' in context.event.message) {
    return true
  }

  return false
}
