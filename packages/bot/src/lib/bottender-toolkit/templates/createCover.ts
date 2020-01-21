/**
 * 適合快速建立 LINE Cover 組件
 */
export const createCover = (data: { imageUrl: string; actionUri?: string }) => {
  const object = {
    type: 'image',
    url: data.imageUrl,
    size: 'full',
    aspectRatio: '20:13',
    aspectMode: 'cover',
    action:
      (data.actionUri && {
        type: 'uri',
        uri: data.actionUri,
      }) ||
      undefined,
  }

  return object
}
