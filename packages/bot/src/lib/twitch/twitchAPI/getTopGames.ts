import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { twitchThumbnailUrlWith } from '@/selectors/twitchThumbnailUrlWith'

export const getTopGames = async () => {
  const { data } = await twitchAPI.helix.games.getTopGames()

  return data.map(item => ({
    coverUrl: twitchThumbnailUrlWith('640x360', item.boxArtUrl),
    id: item.id,
    name: item.name,
  }))
}
