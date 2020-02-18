import { Context, LineContext, TelegramContext } from 'bottender'

export const isLineContext = (
  context: LineContext | TelegramContext,
): context is LineContext => {
  if ('sendFlex' in context && 'getUserProfile' in context) {
    return true
  }

  return false
}
