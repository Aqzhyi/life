import { QueryTwitchStreamsText } from '../constants/texts'

describe('查詢直播指令', () => {
  it('指令正規: [$＄!！]$(直播|live)', () => {
    expect(QueryTwitchStreamsText.test('$直播')).toBe(true)
    expect(QueryTwitchStreamsText.test('＄直播')).toBe(true)
    expect(QueryTwitchStreamsText.test('!直播')).toBe(true)
    expect(QueryTwitchStreamsText.test('！直播')).toBe(true)
    expect(QueryTwitchStreamsText.test('$live')).toBe(true)
    expect(QueryTwitchStreamsText.test('＄live')).toBe(true)
    expect(QueryTwitchStreamsText.test('!live')).toBe(true)
    expect(QueryTwitchStreamsText.test('！live')).toBe(true)
  })

  it('指令正規: $直播 {魔獸/星海/或其他}', () => {
    expect(QueryTwitchStreamsText.test('$直播 魔獸')).toBe(true)
    expect(QueryTwitchStreamsText.test('$直播 星海')).toBe(true)
    expect(QueryTwitchStreamsText.test('$直播 dota')).toBe(true)
    expect(QueryTwitchStreamsText.test('$直播 0f8071555f7d')).toBe(true)
  })
})
