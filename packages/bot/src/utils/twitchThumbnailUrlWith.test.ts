import { twitchThumbnailUrlWith } from '@/utils/twitchThumbnailUrlWith'

describe(twitchThumbnailUrlWith.name, () => {
  it('Twitch 縮圖格式是 {width}x{height} 可以被指定複寫例如 640x360', () => {
    expect(
      twitchThumbnailUrlWith(
        '640x360',
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_lnclnerator-{width}x{height}.jpg',
      ),
    ).toBe(
      'https://static-cdn.jtvnw.net/previews-ttv/live_user_lnclnerator-640x360.jpg',
    )
  })
})
