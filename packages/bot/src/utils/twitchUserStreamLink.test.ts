import { twitchUserStreamLink } from '@/utils/twitchUserStreamLink'

describe(twitchUserStreamLink.name, () => {
  // interface StreamRemote 並沒有直接吐回可連結的直播主網址後後輟名，
  // 若直接使用 StreamRemote["userName"] 接上 twitch.tv 有部份組合無法正確開啟連結
  it('可以拿到直播主網址，適合用於前端開啟連結', () => {
    expect(
      twitchUserStreamLink(
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_lnclnerator-{width}x{height}.jpg',
      ),
    ).toBe('https://www.twitch.tv/lnclnerator')
  })
})
