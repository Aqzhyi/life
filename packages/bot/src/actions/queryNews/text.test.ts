import { createDirectlyText } from '@/utils/createDirectlyText'
import { queryWar3NewsText } from '@/actions/queryNews/text'

describe(`指令「新聞{關鍵字}」`, () => {
  it('辨識出匹配的關鍵字', () => {
    const command = createDirectlyText(queryWar3NewsText)

    expect(command.exec('新聞魔獸')?.groups?.keyword).toBe('魔獸')
    expect(command.exec('新聞泡泡龍')?.groups?.keyword).toBe('泡泡龍')
    expect(command.exec('新聞英雄聯盟')?.groups?.keyword).toBe('英雄聯盟')
    expect(command.exec('新聞暗黑破壞神')?.groups?.keyword).toBe('暗黑破壞神')
    expect(command.exec('新聞jump king')?.groups?.keyword).toBe('jump king')
    expect(command.exec('新聞 mindcraft')?.groups?.keyword).toBe('mindcraft')
  })
})
