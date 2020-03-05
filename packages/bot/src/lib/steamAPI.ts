import { axiosAPI } from '@/lib/axiosAPI'

type PackageDatailFailed = {
  success: 2
}

export type PackageDatailData = {
  [appId: string]: {
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
