import { LineContext, TelegramContext } from 'bottender'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { chunk } from 'lodash'
import ow from 'ow'
import { assertsLineContext } from '@/lib/bottender-toolkit/utils/assertsLineContext'
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
  const MAX_SEND = 10

  const storePromises = (sendPromise?: Promise<any>) => {
    sendPromise && sendPromises.push(sendPromise)
  }

  if (IS_LINE_CONTEXT) {
    try {
      ow(props.bubbles || [], 'props.bubbles', ow.array.minLength(1))
    } catch (error) {
      storePromises(context.sendText('ℹ️ 沒有內容'))
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

          const isReachingMax = dataChunks.length > MAX_SEND

          for (const dataChunk of (isReachingMax &&
            dataChunks.splice(0, MAX_SEND)) ||
            dataChunks) {
            if (dataChunk.length) {
              storePromises(
                context.sendFlex(props.alt || '那個機器人說話了', {
                  type: 'carousel',
                  contents: [...(dataChunk as any)],
                }),
              )
            }
          }

          if (isReachingMax) {
            storePromises(
              context.sendText('訊息太多，未避免洗畫面，在此截斷。'),
            )
          }
        } catch (error) {
          storePromises(context.sendText(`💥 ${error.message}`))
        }
        break
    }
  } else {
    storePromises(context.sendText(i18nAPI.t['error/系統內部錯誤']()))
  }

  return Promise.all(sendPromises)
}
