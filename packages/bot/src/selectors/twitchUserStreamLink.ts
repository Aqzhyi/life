import ow from 'ow'

/** 拿到直播主網址，適合用於前端開啟連結 */
export const twitchUserStreamLink = (thumbnailUrl: string) => {
  ow(thumbnailUrl, ow.string.matches(/^https[\s\S]+live_user_[\s\S]+-/i))
  const urlId = /live_user_(.*?)-/i.exec(thumbnailUrl)?.[1]
  if (urlId) {
    return `https://www.twitch.tv/${urlId}`
  }
  return null
}
