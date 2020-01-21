import { createCover } from './createCover'

/**
 * see createCoverBubble.jpg
 */
export const createCoverBubble = (options: {
  title: string
  subTitle: string
  info?: {
    left?: string
    right?: string
  }
  cover?: {
    imageUrl?: string
    linkUrl?: string
  }
  footer?: string
}) => {
  const defaultsImageUrl =
    'https://twimage.daigobang.com/web/blog/0944f5bf5a5bc7b095157343fee62d7e.jpeg'

  return {
    type: 'bubble',
    hero: createCover({
      imageUrl: options.cover?.imageUrl || defaultsImageUrl,
    }),
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: options.title,
          size: 'xxl',
        },
        {
          type: 'text',
          text: options.subTitle,
          size: 'xs',
          color: '#999999',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: options.info && [
            (options.info.left && {
              type: 'text',
              text: options.info.left,
              size: 'sm',
              color: '#bbbbbb',
            }) ||
              undefined,
            (options.info.right && {
              type: 'text',
              text: options.info.right,
              size: 'sm',
              color: '#bbbbbb',
            }) ||
              undefined,
          ],
        },
        {
          type: 'separator',
          margin: 'xxl',
          color: '#cccccc',
        },
      ],
    },
    footer:
      (options.footer && {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: options.footer,
            color: '#bbbbbb',
          },
        ],
      }) ||
      undefined,
  }
}
