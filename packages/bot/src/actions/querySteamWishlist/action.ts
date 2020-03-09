import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import fetch from 'node-fetch'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import pSeries from 'p-series'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { createText } from '@/lib/line-flex-toolkit/createText'
import {
  FlexSize,
  FlexMargin,
  FlexButtonStyle,
  FlexHeight,
} from '@/lib/line-flex-toolkit/enums'
import { createButton } from '@/lib/line-flex-toolkit/createButton'
import { steamAPI } from '@/lib/steamAPI'
import { chain } from 'lodash'
import { debugAPI } from '@/lib/debugAPI'
import { querySteamWishlistGA } from './ga'

export const querySteamWishlistAction: BottenderAction<WithGroupProps<{
  wishlistUrl: string
}>> = async (context, props) => {
  const log = debugAPI.bot.extend(querySteamWishlistAction.name)

  querySteamWishlistGA.onQuery()

  const wishlistUrl = props.match?.groups?.wishlistUrl
  if (!wishlistUrl) {
    await context.sendText(i18nAPI.t['error/系統內部錯誤']())
    return props.next
  }

  try {
    const htmlText = await fetch(encodeURI(wishlistUrl)).then(res => res.text())

    const profileId = /https:.+?store.steampowered.com.+?wishlist.+?profiles.+[/](?<profileId>\d+).+/i.exec(
      htmlText,
    )?.groups?.profileId

    if (!profileId) {
      throw new Error(
        `從 ${wishlistUrl} 擷取 profileId 時發生錯誤，這可能是一種 BUG（程式邏輯錯誤）。`,
      )
    }

    const data = (
      await pSeries([
        () => steamAPI.getWishlistData({ profileId, page: 1 }),
        () => steamAPI.getWishlistData({ profileId, page: 2 }),
        () => steamAPI.getWishlistData({ profileId, page: 3 }),
        () => steamAPI.getWishlistData({ profileId, page: 4 }),
        () => steamAPI.getWishlistData({ profileId, page: 5 }),
      ])
    ).reduce((prev, current) => {
      current = {
        ...current,
        ...prev,
      }
      return current
    }, {})

    await sendFlex(
      context,
      {
        alt: 'Steam 願望單',
        bubbles: [
          ...chain(data)
            .map(datum => {
              const appId = /steam[/]apps[/](?<appId>\d+)[/]/i.exec(
                datum.capsule,
              )?.groups?.appId

              const steamLink = `https://store.steampowered.com/app/${appId}`

              return createSmallCardBubble({
                coverUrl: datum.capsule,
                title: datum.name,
                link: steamLink,
                contents: [
                  (!datum.subs?.length &&
                    createText({
                      text: '此遊戲尚未在 Steam 上推出 Coming Soon',
                      wrap: true,
                    })) ||
                    null,
                  ...(datum.subs
                    ?.map((subItem, index) => [
                      createText({
                        text:
                          `${subItem.price / 100} 台幣` +
                          ((subItem.discountPct > 0 &&
                            ` (-${subItem.discountPct}%)`) ||
                            ''),
                        size: FlexSize.sm,
                      }),
                    ])
                    .flat() || []),
                ],
                footerContents: [
                  createButton({
                    action: { label: '查看 Steam', uri: steamLink },
                    height: FlexHeight.sm,
                    style: FlexButtonStyle.primary,
                  }),
                ],
              })
            })
            .value(),
        ],
      },
      { preset: 'LINE_CAROUSEL' },
    )
  } catch (error) {
    querySteamWishlistGA.onError(error)
    await context.sendText(error.message)
  }

  return props.next
}
