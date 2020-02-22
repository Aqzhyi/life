import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { isTelegramContext } from '@/lib/bottender-toolkit/utils/isTelegramContext'

describe(sendFlex.name, () => {
  it('能分辨 Context 屬於 Line | Telegram 使用相應的「類 sendFlex」函數', async () => {
    const contexts = new Set([
      new ContextMock('填充滿滿的文字').lineContext,
      new ContextMock('填充滿滿的文字').telegramContext,
    ])

    contexts.forEach(context => {
      sendFlex(
        context,
        {
          alt: '替代文字',
          bubbles: [
            createSmallCardBubble({
              content: '{content}',
              link: '{link}',
              coverUrl: '{coverUrl}',
              title: '{title}',
              subtitle: '{subtitle}',
            }),
          ],
          text: '',
        },
        { preset: 'LINE_CAROUSEL' },
      )

      isLineContext(context) && expect(context.sendFlex).toBeCalledTimes(1)

      isTelegramContext(context) &&
        expect(context.sendMessage).toBeCalledTimes(1)
    })
  })
})
