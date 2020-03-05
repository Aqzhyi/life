import { LineContext, TelegramContext } from 'bottender'
import ow from 'ow'

export function assertsTelegramContext(
  context: unknown,
): asserts context is TelegramContext {
  ow(
    (context as TelegramContext).event.message.from,
    'context is Telegram context',
    ow.string.nonEmpty,
  )
}
