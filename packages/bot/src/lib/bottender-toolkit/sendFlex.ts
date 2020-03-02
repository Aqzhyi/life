import { LineContext, TelegramContext } from 'bottender'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { chunk } from 'lodash'
import ow from 'ow'
import { assertsLineContext } from '@/lib/bottender-toolkit/asserts'
import { i18nAPI } from '@/lib/i18n/i18nAPI'

export const sendFlex = (
  context: LineContext | TelegramContext,
  props: {
    /** LINE.sendFlex 的替代文字 */
    alt: string
    /** LINE bubble 資料，適合傳入自訂 bubble 格式供 LINE.sendFlex 的時候使用 */
    bubbles?: object[]
  },
  options: {
    /** 指定採用 preset */
    preset: 'LINE_CAROUSEL'
  },
): Promise<any> => {
  const sendPromises: NonNullable<ReturnType<typeof context['sendText']>>[] = []
  const IS_LINE_CONTEXT = isLineContext(context)
  const PER_CHUNK = 10

  if (IS_LINE_CONTEXT) {
    try {
      ow(props.bubbles || [], 'props.bubbles', ow.array.minLength(1))
    } catch (error) {
      const promise = context.sendText('ℹ️ 沒有內容')
      promise && sendPromises.push(promise)
    }
  }

  if (IS_LINE_CONTEXT) {
    switch (options.preset) {
      case 'LINE_CAROUSEL':
        try {
          assertsLineContext(context)

          /**
           * 經由 lodash.chunk 切過後的二維資料。因 LINE.sendFlex 一次最多只能發送十條。
           */
          const dataChunks = chunk(props.bubbles, PER_CHUNK)

          for (const dataChunk of dataChunks) {
            if (dataChunk.length) {
              const promise = context.sendFlex(
                props.alt || '那個機器人說話了',
                {
                  type: 'carousel',
                  contents: [...(dataChunk as any)],
                },
              )
              promise && sendPromises.push(promise)
            }
          }
        } catch (error) {
          console.error(error.message)
          context.sendText(`💥 ${error.message}`)
        }
        break
    }
  } else {
    const promise = context.sendText(i18nAPI.t['error/系統內部錯誤']())
    promise && sendPromises.push(promise)
  }

  return Promise.all(sendPromises)
}
