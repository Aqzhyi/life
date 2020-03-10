import { showTwitchTopGamesAction } from '@/actions/showTwitchTopGames/action'
import { createMockAPI } from '@/lib/twitchAPI.mock'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'

createMockAPI.getTopGames(10)

describe(showTwitchTopGamesAction.name, () => {
  it('預設場景下，會發送 flex 內容；每十個單位一次', async done => {
    const context = new ContextMock('直播').lineContext

    await showTwitchTopGamesAction(context, {})

    expect(context.sendFlex).toBeCalledTimes(10)
    expect(context.sendText).toBeCalledTimes(0)
    done()
  })
})
