import { QueryTwitchStreamsText } from '@/configs/TEXT'
import { createCommandText } from '@/utils/createCommandText'

describe('指令正規', () => {
  it('查詢直播頻道: [!！]$(直播|live)', () => {
    const command = createCommandText(QueryTwitchStreamsText)
    expect(command.test('!直播')).toBe(true)
    expect(command.test('！直播')).toBe(true)
    expect(command.test('!live')).toBe(true)
    expect(command.test('！live')).toBe(true)
    expect(command.test('！直播 魔獸')).toBe(true)
    expect(command.test('！直播 星海')).toBe(true)
    expect(command.test('！直播 dota')).toBe(true)
    expect(command.test('！直播魔獸')).toBe(true)
    expect(command.test('！直播星海')).toBe(true)
    expect(command.test('！直播dota')).toBe(true)
    expect(command.test('！直播lol')).toBe(true)
    expect(command.test('！直播LOL')).toBe(true)
    expect(command.test('！直播WOW')).toBe(true)
    expect(command.test('！直播OW')).toBe(true)
    expect(command.test('！直播 0f8071555f7d')).toBe(true)

    expect(command.test('$300')).toBe(false)
    expect(command.test('$直播dota')).toBe(false)
    expect(command.test('$直播lol')).toBe(false)
    expect(command.test('$直播LOL')).toBe(false)
    expect(command.test('$直播WOW')).toBe(false)
    expect(command.test('$直播OW')).toBe(false)
    expect(command.test('$直播 0f8071555f7d')).toBe(false)
  })
})
