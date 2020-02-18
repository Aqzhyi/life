import { LineContext, TelegramContext } from 'bottender'
import { isLineContext } from '@/lib/bottender-toolkit/isLineContext'
import { chunk } from 'lodash'
import ow from 'ow'
import {
  assertsLineContext,
  assertsTelegramContext,
} from '@/lib/bottender-toolkit/asserts'
import replaceString from 'replace-string'
import { replaceStringTabSpace } from '@/utils/replaceStringTabSpace'

export const sendFlex = (
  context: LineContext | TelegramContext,
  props: {
    /** LINE.sendFlex 的替代文字 */
    alt: string
    /** 適合當 context 沒有 LINE.sendFlex 的時候使用 */
    text?: string
    /** LINE bubble 資料，適合傳入自訂 bubble 格式供 LINE.sendFlex 的時候使用 */
    bubbles?: any[]
  },
  options: {
    /** 指定採用 preset */
    preset: 'LINE_CAROUSEL'
  },
) => {
  const IS_LINE_CONTEXT = isLineContext(context)
  const PER_CHUNK = 10

  if (IS_LINE_CONTEXT) {
    ow(props.bubbles || [], 'props.bubbles', ow.array.minLength(1))
  } else {
    ow(props.text, 'props.text', ow.string.minLength(1))
  }

  switch (options.preset) {
    case 'LINE_CAROUSEL':
      try {
        if (IS_LINE_CONTEXT) {
          assertsLineContext(context)

          /**
           * 經由 lodash.chunk 切過後的二維資料。因 LINE.sendFlex 一次最多只能發送十條。
           */
          const dataChunks = chunk(props.bubbles, PER_CHUNK)

          for (const dataChunk of dataChunks) {
            if (dataChunk.length) {
              return context.sendFlex(props.alt || '那個機器人說話了', {
                type: 'carousel',
                contents: [...dataChunk],
              })
            }
          }
        } else {
          assertsTelegramContext(context)

          return context.sendMessage(
            replaceStringTabSpace(
              `➖➖➖➖➖➖➖➖
              *${props.alt}*
              ➖➖➖➖➖➖➖➖
              ${props.text}`,
            ),
            {
              parseMode: 'Markdown' as any,
            },
          )
        }
      } catch (error) {
        console.error(error.message)
        return context.sendText(`💥 ${error.message}`)
      }
      break
  }
}
