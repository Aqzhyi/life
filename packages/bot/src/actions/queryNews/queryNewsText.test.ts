import { createDirectlyText } from '@/utils/createDirectlyText'
import { queryWar3NewsText } from '@/actions/queryNews/queryNewsText'

describe('新聞系統', () => {
  it('指令正規："{關鍵字}新聞" 可辨別出匹配 關鍵字 as "keyword"', () => {
    const command = createDirectlyText(queryWar3NewsText)
    expect(command.exec('魔獸新聞')?.groups?.keyword).toBe('魔獸')
    expect(command.exec('泡泡龍新聞')?.groups?.keyword).toBe('泡泡龍')
    expect(command.exec('英雄聯盟新聞')?.groups?.keyword).toBe('英雄聯盟')
    expect(command.exec('暗黑破壞神新聞')?.groups?.keyword).toBe('暗黑破壞神')
    expect(command.exec('jump king 新聞')?.groups?.keyword.trim()).toBe(
      'jump king',
    )
  })
})
