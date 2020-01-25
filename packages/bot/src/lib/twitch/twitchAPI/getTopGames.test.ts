import { getTopGames } from './getTopGames'
import { twitchAPI } from '../twitchAPI'
import { HelixGame } from 'twitch'

twitchAPI.helix.games.getTopGames = jest
  .fn(twitchAPI.helix.games.getTopGames)
  .mockImplementation(() =>
    Promise.resolve({
      data: [
        {
          id: '29595',
          name: 'Dota 2',
          boxArtUrl:
            'https://static-cdn.jtvnw.net/ttv-boxart/Dota%202-{width}x{height}.jpg',
        } as HelixGame,
      ],
      pagination: {
        cursor: 'eyJzIjoyMCwiZCI6ZmFsc2UsInQiOnRydWV9',
      },
    }),
  )

describe(getTopGames.name, () => {
  it('會將 boxArtUrl 直譯成 coverUrl 適合直接面向終端使用者', async () => {
    const data = await getTopGames()
    expect(data[0].coverUrl).toBeDefined()
  })
})
