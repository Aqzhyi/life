import ow from 'ow'

export const twitchThumbnailUrlWith = (widthAndHeight: string, url: string) => {
  ow(widthAndHeight, ow.string.matches(/\d{2,4}x\d{2,4}/))
  return url.replace('{width}x{height}', widthAndHeight)
}
