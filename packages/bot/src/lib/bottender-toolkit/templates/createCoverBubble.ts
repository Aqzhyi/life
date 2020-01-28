import { createCover } from './createCover'

/**
 * see createCoverBubble.jpg
 */
export const createStreamInfoBubble = (options: {
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
}) => {
  const defaultsImageUrl =
    'https://twimage.daigobang.com/web/blog/0944f5bf5a5bc7b095157343fee62d7e.jpeg'

  const info =
    (options.info && [
      {
        type: 'box',
        layout: 'horizontal',
        contents: [
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
    ]) ||
    []

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
        ...info,
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          action: {
            type: 'uri',
            label: '查看',
            uri: options.cover?.linkUrl,
          },
        },
      ],
    },
  }
}
