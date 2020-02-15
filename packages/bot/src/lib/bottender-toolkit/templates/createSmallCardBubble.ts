import dayjs from 'dayjs'

const DEFAULT_COVER_URL =
  'https://twimage.daigobang.com/web/blog/0944f5bf5a5bc7b095157343fee62d7e.jpeg'

export const createSmallCardBubble = (options: {
  coverUrl?: string
  link: string
  subtitle?: string
  title: string
  /**
   * 允許單行，或傳術 Array 表示多行
   */
  content: string | string[]
}) => {
  if (options.coverUrl?.startsWith('http://')) {
    console.warn(
      `WARNING: bubble/hero/url 只接受 https 安全連線，傳入的 ${options.title} 圖片不符合 LINE 要求`,
    )
  }

  const contents = Array.isArray(options.content)
    ? options.content.map(stringValue => ({
        type: 'text',
        text: stringValue,
        size: 'xxs',
        color: '#cccccc',
      }))
    : [
        {
          type: 'text',
          text: options.content,
          size: 'xxs',
          color: '#cccccc',
        },
      ]

  return {
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
              contents: [
                {
                  type: 'text',
                  text: options.subtitle || '不明',
                  wrap: true,
                  color: '#8c8c8c',
                  size: 'xs',
                  flex: 5,
                },
                ...contents,
              ],
            },
          ],
        },
      ],
      spacing: 'sm',
      paddingAll: '13px',
    },
  }
}
