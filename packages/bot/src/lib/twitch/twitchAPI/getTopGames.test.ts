import { getTopGames } from './getTopGames'
import { createMockAPI } from '@/lib/twitch/twitchAPI.mock'

createMockAPI.getTopGames(10)

describe(getTopGames.name, () => {
  it('會將 boxArtUrl 直譯成 coverUrl 適合直接面向終端使用者', async () => {
    const data = await getTopGames()
    expect(data[0].coverUrl).toBeDefined()
  })
})
