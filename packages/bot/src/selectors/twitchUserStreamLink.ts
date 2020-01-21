import ow from 'ow'

export const twitchUserStreamLink = (thumbnailUrl: string) => {
  ow(thumbnailUrl, ow.string.matches(/^https[\s\S]+live_user_[\s\S]+-/i))
  const urlId = /live_user_(.*?)-/i.exec(thumbnailUrl)?.[1]
  if (urlId) {
    return `https://www.twitch.tv/${urlId}`
  }
  return null
}
