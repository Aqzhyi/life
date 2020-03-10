import { isKeywordSelector } from './isKeywordSelector'

describe(isKeywordSelector.name, () => {
  it('能夠判斷傳入的字串是遊戲關鍵字', () => {
    expect(isKeywordSelector('星海')).toBe(true)
    expect(isKeywordSelector('魔獸')).toBe(true)
    expect(isKeywordSelector('魔獸世界')).toBe(true)
    expect(isKeywordSelector('LOL')).toBe(true)
    expect(isKeywordSelector('lol')).toBe(true)
    expect(isKeywordSelector('英雄聯盟')).toBe(true)
    expect(isKeywordSelector('cod')).toBe(true)
    expect(isKeywordSelector('絕對武力')).toBe(true)

    expect(isKeywordSelector('韓國瑜')).toBe(false)
    expect(isKeywordSelector('蔡英文')).toBe(false)
    expect(isKeywordSelector('data')).toBe(false)
    expect(isKeywordSelector('wc5')).toBe(false)
  })
})
