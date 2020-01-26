import { QueryTwitchStreams } from '@/actions/QueryTwitchStreams'
import { ContextSimulator } from 'bottender/test-utils'
import { createMockAPI } from '@/lib/twitch/twitchAPI.mock'

createMockAPI.helix.games.getGameByName()
createMockAPI.helix.streams.getStreams()

describe(QueryTwitchStreams.name, () => {
  const simulator = new ContextSimulator({ platform: 'line' })

  it('預設場景下，會發送 flex 內容', async done => {
    const context = simulator.createTextContext()
    context.sendFlex = jest.fn()
    context.sendText = jest.fn()
    context.getUserProfile = jest.fn()

    // 試著查一個不列於冊的小眾遊戲，應也可透過 twitchAPI 查得
    await QueryTwitchStreams(context, {
      match: { groups: { inputKeyword: `No Man's Sky` as any } },
    })

    expect(context.sendText).toBeCalledTimes(0)
    expect(context.sendFlex).toBeCalledTimes(1)
    done()
  })
})
