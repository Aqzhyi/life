import twitch from 'twitch'
import { getTopGames } from './twitchAPI/getTopGames'

const twitchClient = twitch.withClientCredentials(process.env.TWITCH_CLIENT_ID)

export const twitchAPI = {
  helix: twitchClient.helix,
  getTopGames,
}
