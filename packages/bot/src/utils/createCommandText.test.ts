import { createCommandText } from '@/utils/createCommandText'

describe(createCommandText.name, () => {
  it('驚嘆號指令不區分半形全形', () => {
    expect(createCommandText('直播').test('！直播魔獸')).toBe(true)
    expect(createCommandText('直播').test('!直播魔獸')).toBe(true)
  })

  it('驚嘆號指令必須在開頭', () => {
    expect(createCommandText('直播').test(' ！直播魔獸')).toBe(false)
    expect(createCommandText('直播').test('$！直播魔獸')).toBe(false)
    expect(createCommandText('直播').test('你打指令 ！直播魔獸')).toBe(false)
  })
})
