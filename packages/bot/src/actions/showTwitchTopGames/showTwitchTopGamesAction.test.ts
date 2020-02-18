import { showTwitchTopGamesAction } from '@/actions/showTwitchTopGames/showTwitchTopGamesAction'
import { createMockAPI } from '@/lib/twitch/twitchAPI.mock'
import { ContextMock } from '@/lib/bottender-toolkit/contextMock'

createMockAPI.getTopGames(10)

describe(showTwitchTopGamesAction.name, () => {
  it('預設場景下，會發送 flex 內容；每十個單位一次', async done => {
    const { context } = new ContextMock('直播', { platform: 'line' })

    await showTwitchTopGamesAction(context, {})

    expect(context.sendFlex).toBeCalledTimes(10)
    expect(context.sendText).toBeCalledTimes(0)
    done()
  })
})
