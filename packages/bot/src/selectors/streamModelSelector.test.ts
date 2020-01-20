import { streamModelSelector } from '@/selectors/streamModelSelector'
import { StreamRemote } from '@/lib/twitch/resources/StreamRemote'
import { i18nAPI } from '@/lib/i18n/i18nAPI'

describe(streamModelSelector.name, () => {
  let data: StreamRemote

  beforeEach(() => {
    data = {
      id: '36713832096',
      userId: '22523901',
      userName: 'lnclnerator',
      gameId: '12924',
      type: 'live',
      title: 'WAR3 REFORGED!  BIG FFAs! Weekend Replays Streams',
      viewerCount: 44,
      startedAt: '2020-01-20T08:01:46Z',
      language: 'zh',
      thumbnailUrl:
        'https://static-cdn.jtvnw.net/previews-ttv/live_user_lnclnerator-{width}x{height}.jpg',
      tagIds: ['74c92063-a389-4fd2-8460-b1bb82b04ec7'],
    }
  })

  it('模型屬性', async () => {
    await i18nAPI.init()
    expect(streamModelSelector(data)?.coverUrl).toBeDefined()
    expect(streamModelSelector(data)?.name).toBeDefined()
    expect(streamModelSelector(data)?.siteLink).toBeDefined()
    expect(streamModelSelector(data)?.startedAt).toBeDefined()
    expect(streamModelSelector(data)?.title).toBeDefined()
    expect(streamModelSelector(data)?.viewerCount).toBeDefined()
  })

  it('可以拿到該直播主的直播網址', () => {
    expect(streamModelSelector(data)?.siteLink).toBe(
      'https://www.twitch.tv/lnclnerator',
    )
  })

  it('可以拿到該直播主的直播縮圖，複寫了 {width}x{height}', () => {
    expect(
      /{width}x{height}/i.test(streamModelSelector(data)?.siteLink || ''),
    ).toBe(false)
  })
})
