import { querySteamWishlistAction } from './action'
import { querySteamWishlistText } from './text'
import { createCommandText } from '@/utils/createCommandText'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'
import '@/lib/steamAPI.mock'

describe(querySteamWishlistAction.name, () => {
  it('能正確判斷傳入得願望單網址', async done => {
    const command = createCommandText(querySteamWishlistText)

    expect(
      command.test(
        '!https://store.steampowered.com/wishlist/id/hipigg/#sort=order',
      ),
    ).toBe(true)

    expect(
      command.exec(
        '!https://store.steampowered.com/wishlist/id/hipigg/#sort=order',
      )?.groups?.wishlistUrl,
    ).toBe('https://store.steampowered.com/wishlist/id/hipigg/#sort=order')

    done()
  })

  it('能正確發送訊息', async done => {
    const context = new ContextMock(
      '!https://store.steampowered.com/wishlist/id/hipigg/#sort=order',
    ).lineContext

    await querySteamWishlistAction(context, {
      match: {
        groups: {
          wishlistUrl:
            'https://store.steampowered.com/wishlist/id/hipigg/#sort=order',
        },
      },
    })

    expect(context.sendFlex).toBeCalledTimes(2)

    done()
  })
})
