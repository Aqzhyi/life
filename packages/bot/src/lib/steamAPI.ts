import { axiosAPI } from '@/lib/axiosAPI'
import cheerio from 'cheerio'
import ow from 'ow'

type PackageDatailFailed = {
  success: 2
}

export type PackageDatailData = {
  [subId: string]: {
    success: boolean
    data: {
      name: string
      pageImage: string
      smallLogo: string
      apps: [
        {
          id: number
          name: string
        },
      ]
      price: {
        currency: string
        initial: number
        final: number
        discountPercent: number
        individual: number
      }
      platforms: {
        windows: boolean
        mac: boolean
        linux: boolean
      }
      controller: {
        fullGamepad: boolean
      }
      releaseDate: {
        comingSoon: boolean
        /** 2020年1月3日 */
        date: string
      }
    }
  }
}

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

function assertsPackageDatailDatum(
  data: unknown,
): asserts data is PackageDatailData {}

export const steamAPI = {
  /**
   * Get SteamData via AppId or SteamAppUrl
   *
   * e.g. `'https://store.steampowered.com/app/1127400'`
   */
  async getAppSubData(appIdOrAppUrl?: string) {
    let appId: string | undefined
    const label = `${steamAPI.getAppSubData.name}(appIdOrAppUrl)`
    const tmp1: {
      name?: string
      subId?: string
      price?: number
    } = {}

    ow(appIdOrAppUrl, label, ow.string)

    if (appIdOrAppUrl?.startsWith('http')) {
      const htmlText = (await axiosAPI.get(appIdOrAppUrl)).data

      tmp1.subId = cheerio(htmlText)
        .find('[name="subid"]')
        .attr('value') as string
    } else {
      appId =
        /https:\/\/.*?steampowered.*?com\/app\/(?<appId>[\d]+)/i.exec(
          appIdOrAppUrl || '',
        )?.groups?.appId || appIdOrAppUrl

      if (!appId) {
        throw new Error(`${label} 找不到 appId。`)
      }

      const htmlText = (
        await axiosAPI.get(`https://store.steampowered.com/app/${appId}`)
      ).data

      tmp1.subId = cheerio(htmlText)
        .find('[name="subid"]')
        .attr('value') as string

      tmp1.name = cheerio(htmlText)
        .find('.apphub_AppName')
        .text()
        .trim()
    }

    try {
      ow(tmp1.subId, label, ow.string.nonEmpty)
      ow(tmp1.name, label, ow.string.nonEmpty)
    } catch (error) {
      throw new Error(
        `${label} 必須是 appId 或 steamAppUrl，傳入的參數 "${appIdOrAppUrl}" 找不到 {name, subId}，得到 ${JSON.stringify(
          tmp1,
        )}。`,
      )
    }
    if (!tmp1.subId || !appId) return

    const data = await steamAPI.getPackageDatail({
      subId: Number(tmp1.subId),
      location: 'tw',
    })

    if (data.success !== 2) {
      assertsPackageDatailDatum(data)
      return data[tmp1.subId].data
    }

    return null
  },
  async getWishlistData(props: {
    profileId: string
    page: number
  }): Promise<{
    [appId: string]: SteamApp
  }> {
    const { data } = await axiosAPI.get<{
      [appId: string]: SteamApp
    }>(
      `https://store.steampowered.com/wishlist/profiles/${
        props.profileId
      }/wishlistdata/?p=${props.page - 1}`,
    )

    for (const [appId, steamApp] of Object.entries(data)) {
      for await (const target of steamApp.subs || []) {
        steamAPI
          .getPackageDatail({
            subId: target?.id,
          })
          .then(targetToMerging => {
            if (targetToMerging.success !== 2) {
              assertsPackageDatailDatum(targetToMerging)
              target.price = targetToMerging[target.id].data.price.final
            }
          })
      }
    }

    return data
  },
  async getPackageDatail(props: { subId?: number; location?: 'tw' | 'us' }) {
    const { data } = await axiosAPI.get<
      PackageDatailFailed | PackageDatailData
    >(
      `https://store.steampowered.com/api/packagedetails/?packageids=${
        props.subId
      }&cc=${props.location || 'tw'}`,
    )

    return data
  },
}
