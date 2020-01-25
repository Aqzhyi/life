import { ContextSimulator } from 'bottender/test-utils'
import { ShowTwitchTopGamesButton } from '@/actions/ShowTwitchTopGamesButton'
import * as getTopGames from '@/lib/twitch/twitchAPI/getTopGames.mock'

getTopGames.createMock(10)

describe(ShowTwitchTopGamesButton.name, () => {
  const simulator = new ContextSimulator({ platform: 'line' })

  it('預設場景下，會發送 flex 內容；每十個單位一次', async done => {
    const context = simulator.createTextContext('直播')
    context.sendFlex = jest.fn(context.sendFlex)
    context.sendText = jest.fn(context.sendText)

    await ShowTwitchTopGamesButton(context, {})

    expect(context.sendFlex).toBeCalledTimes(10)
    expect(context.sendText).toBeCalledTimes(0)
    done()
  })
})
