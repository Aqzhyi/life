import { createDirectlyText } from '@/utils/createDirectlyText'

describe(createDirectlyText.name, () => {
  it('可以加上，或不加上驚探號指令', () => {
    expect(createDirectlyText('直播').test('！直播魔獸')).toBe(true)
    expect(createDirectlyText('直播').test('!直播魔獸')).toBe(true)
  })

  it('指令名稱必須在開頭', () => {
    expect(createDirectlyText('直播').test(' 直播魔獸')).toBe(false)
    expect(createDirectlyText('直播').test('你打指令 直播魔獸')).toBe(false)
    expect(createDirectlyText('直播').test('$直播魔獸')).toBe(false)
    expect(createDirectlyText('直播').test('#直播魔獸')).toBe(false)
  })
})
