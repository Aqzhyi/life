import { twitchThumbnailUrlWith } from '@/selectors/twitchThumbnailUrlWith'
import twitch from 'twitch'

const twitchClient = twitch.withClientCredentials(process.env.TWITCH_CLIENT_ID)

export const twitchAPI = {
  helix: twitchClient.helix,
  async getTopGames() {
    const { data } = await twitchAPI.helix.games.getTopGames()

    return data.map(item => ({
      coverUrl: twitchThumbnailUrlWith('640x360', item.boxArtUrl),
      id: item.id,
      name: item.name,
    }))
  },
}
