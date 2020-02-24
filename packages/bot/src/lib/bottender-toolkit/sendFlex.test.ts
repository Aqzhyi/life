import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { range } from 'lodash'

describe(sendFlex.name, () => {
  it('能自動切割 bubbles 多次發送，以符合 sendFlex 每次請求只能 10 筆的限制', async () => {
    const context = new ContextMock('填充滿滿的文字').lineContext

    const bubbles = range(0, 20).map(() =>
      createSmallCardBubble({
        contents: ['{content}'],
        link: '{link}',
        coverUrl: '{coverUrl}',
        title: '{title}',
        subtitle: '{subtitle}',
      }),
    )

    sendFlex(
      context,
      {
        alt: '替代文字',
        bubbles,
      },
      { preset: 'LINE_CAROUSEL' },
    )

    expect(context.sendFlex).toBeCalledTimes(2)
  })
})
