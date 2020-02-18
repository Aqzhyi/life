import { queryTwitchStreamsAction } from './queryTwitchStreamsAction'
import { createMockAPI } from '@/lib/twitch/twitchAPI.mock'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'

createMockAPI.helix.games.getGameByName()
createMockAPI.helix.streams.getStreams()

describe(queryTwitchStreamsAction.name, () => {
  it('預設場景下，會發送 flex 內容', async done => {
    const context = new ContextMock('填充滿滿的文字').lineContext

    // 試著查一個不列於冊的小眾遊戲，應也可透過 twitchAPI 查得
    await queryTwitchStreamsAction(context, {
      match: { groups: { inputKeyword: `No Man's Sky` as any } },
    })

    expect(context.sendText).toBeCalledTimes(0)
    expect(context.sendFlex).toBeCalledTimes(1)
    done()
  })
})
