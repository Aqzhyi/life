import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import fetch from 'node-fetch'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import pSeries from 'p-series'
import { camelizeKeys } from 'humps'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import { createText } from '@/lib/line-flex-toolkit/createText'
import { createSeparator } from '@/lib/line-flex-toolkit/createSeparator'
import {
  FlexSize,
  FlexMargin,
  FlexButtonStyle,
  FlexHeight,
} from '@/lib/line-flex-toolkit/enums'
import { createButton } from '@/lib/line-flex-toolkit/createButton'

interface SteamApp {
  name: string
  capsule: string
  reviewScore: number
  reviewDesc: string
  reviewsTotal: string
  reviewsPercent: number
  releaseDate: string
  releaseString: string
  platformIcons: string
  subs?: {
    id: number
    discountBlock: string
    discountPct: number
    price: number
  }[]
  type: string
  screenshots: string[]
  reviewCss: string
  priority: number
  added: number
  background: string
  rank: number
  tags: any[]
  isFreeGame: boolean
  win: number
}

const fetchWishlistdata = async (profileId: string, page: number) =>
  fetch(
    `https://store.steampowered.com/wishlist/profiles/${profileId}/wishlistdata/?p=${page}`,
  ).then(res => res.json())

export const querySteamWishlist: BottenderAction<WithGroupProps<{
  wishlistUrl: string
}>> = async (context, props) => {
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

    const data = camelizeKeys(
      (
        await pSeries([
          () => fetchWishlistdata(profileId, 0),
          () => fetchWishlistdata(profileId, 1),
          () => fetchWishlistdata(profileId, 2),
          () => fetchWishlistdata(profileId, 3),
          () => fetchWishlistdata(profileId, 4),
        ])
      )
        .flatMap((item, key) => Object.values(item))
        .filter(item => typeof item !== 'number'),
    ) as SteamApp[]

    if (!data.length) {
      await context.sendText('你沒有願望單內容，或者是你的願望單未公開')
    } else {
      await sendFlex(
        context,
        {
          alt: 'Steam 願望單',
          bubbles: [
            ...data
              .filter(datum => datum.subs?.length)
              .map(datum => {
                const appId = /steam[/]apps[/](?<appId>\d+)[/]/i.exec(
                  datum.capsule,
                )?.groups?.appId

                if (!appId) {
                  throw new Error(
                    `從 ${datum.capsule} 擷取 appId 時發生錯誤，這可能是一種 BUG（程式邏輯錯誤）。`,
                  )
                }

                const steamLink = `https://store.steampowered.com/app/${appId}`

                return createSmallCardBubble({
                  coverUrl: datum.capsule,
                  title: datum.name,
                  link: steamLink,
                  contents: [
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
              }),
          ],
        },
        { preset: 'LINE_CAROUSEL' },
      )
    }
  } catch (error) {
    await context.sendText(error.message)
  }

  return props.next
}
