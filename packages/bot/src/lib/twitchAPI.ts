import twitch from 'twitch'

const twitchClient = twitch.withClientCredentials(process.env.TWITCH_CLIENT_ID)

export const twitchAPI = {
  helix: twitchClient.helix,
}
