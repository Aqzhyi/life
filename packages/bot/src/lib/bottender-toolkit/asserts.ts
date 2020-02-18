/* eslint-disable @typescript-eslint/no-empty-function */
import { LineContext, TelegramContext } from 'bottender'

export function assertsLineContext(
  context: unknown,
): asserts context is LineContext {}

export function assertsTelegramContext(
  context: unknown,
): asserts context is TelegramContext {}
