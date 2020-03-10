import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { TwitchGameId } from '@/enums/TwitchGameId'
import { twitchGameSelector } from './twitchGameSelector'

describe(twitchGameSelector.name, () => {
  beforeEach(async () => {
    await i18nAPI.init()
  })

  it('傳入 keyword 得到 { id, title }', async () => {
    expect(twitchGameSelector('星海')).toStrictEqual({
      id: TwitchGameId.starcraft2,
      title: i18nAPI.t['game/sc2'](),
    })

    expect(twitchGameSelector('dota')).toStrictEqual({
      id: TwitchGameId.Dota2,
      title: i18nAPI.t['game/dota2'](),
    })

    expect(twitchGameSelector('wc')).toStrictEqual({
      id: TwitchGameId.warcraft3,
      title: i18nAPI.t['game/wc3'](),
    })

    expect(twitchGameSelector('lol')).toStrictEqual({
      id: TwitchGameId.leagueOfLegends,
      title: i18nAPI.t['game/lol'](),
    })
  })

  it('傳入 非法 keyword 得到 null', async () => {
    expect(twitchGameSelector('' as any)).toBe(null)
    expect(twitchGameSelector('i2dg83nv8fh' as any)).toBe(null)
    expect(twitchGameSelector('data' as any)).toBe(null)
  })
})
