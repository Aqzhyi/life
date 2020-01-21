import { StreamRemote } from '@/lib/twitch/resources/StreamRemote'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import dayjs from 'dayjs'
import { twitchThumbnailUrlWith } from '@/selectors/twitchThumbnailUrlWith'

export const streamModelSelector = (data: StreamRemote) => {
  const urlId = /live_user_(.*?)-/i.exec(data.thumbnailUrl)?.[1]

  if (!urlId) {
    return null
  }

  return {
    siteLink: `https://www.twitch.tv/${urlId}`,
    coverUrl: twitchThumbnailUrlWith('640x360', data.thumbnailUrl),
    name: data.userName,
    title: data.title,
    viewerCount: i18nAPI.t('text/觀看人數', {
      value: data.viewerCount,
    }),
    startedAt: i18nAPI.t('text/開播時間', {
      value: dayjs(data.startedAt).format('HH:mm'),
    }),
  }
}
