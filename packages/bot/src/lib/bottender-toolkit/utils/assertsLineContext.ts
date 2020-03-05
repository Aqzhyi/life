import { LineContext } from 'bottender'
import ow from 'ow'

export function assertsLineContext(
  context: unknown,
): asserts context is LineContext {
  ow((context as LineContext).sendFlex, 'context is LINE context', ow.function)
}
