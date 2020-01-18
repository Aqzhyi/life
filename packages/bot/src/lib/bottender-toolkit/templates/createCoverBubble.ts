/**
 * see createCoverBubble.jpg
 */
export const createCoverBubble = (options: {
  title: string
  subTitle: string
  info: {
    left: string
    right: string
  }
  cover: {
    imageUrl: string
    linkUrl: string
  }
  footer: string
}) => {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: options.cover.imageUrl,
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
      action: {
        type: 'uri',
        uri: options.cover.linkUrl,
      },
    },
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
          contents: [
            {
              type: 'text',
              text: options.info.left,
              size: 'sm',
              color: '#bbbbbb',
            },
            {
              type: 'text',
              text: options.info.right,
              size: 'sm',
              color: '#bbbbbb',
            },
          ],
        },
        {
          type: 'separator',
          margin: 'xxl',
          color: '#cccccc',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: options.footer,
          color: '#bbbbbb',
        },
      ],
    },
  }
}
