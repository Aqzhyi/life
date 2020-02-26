import dayjs from 'dayjs'

const DEFAULT_COVER_URL =
  'https://twimage.daigobang.com/web/blog/0944f5bf5a5bc7b095157343fee62d7e.jpeg'

export const createSmallCardBubble = (options: {
  coverUrl?: string
  link: string
  subtitle?: string
  title: string
  contents: (object | undefined | null)[]
  footerContents?: object[]
}) => {
  if (options.coverUrl?.startsWith('http://')) {
    console.warn(
      `WARNING: bubble/hero/url 只接受 https 安全連線，傳入的 ${options.title} 圖片不符合 LINE 要求`,
    )
  }

  const base = {
    type: 'bubble',
    size: 'micro',
    hero: {
      type: 'image',
      url:
        options.coverUrl?.replace('http://', 'https://') || DEFAULT_COVER_URL,
      size: 'full',
      aspectMode: 'cover',
      aspectRatio: '320:213',
      action: {
        type: 'uri',
        label: 'action',
        uri: options.link,
      },
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: options.title,
          weight: 'bold',
          size: 'xxs',
          wrap: true,
          action: {
            type: 'uri',
            label: 'action',
            uri: options.link,
          },
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [...options.contents.filter(item => item)],
            },
          ],
        },
      ],
      spacing: 'sm',
      paddingAll: '13px',
    },
  }

  const footer =
    (options.footerContents?.length && {
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        flex: 0,
        contents: [...options.footerContents],
      },
    }) ||
    {}

  return {
    ...base,
    ...footer,
  }
}
