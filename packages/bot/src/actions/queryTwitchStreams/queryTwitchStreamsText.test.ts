import { queryTwitchStreamsText } from '@/actions/queryTwitchStreams/queryTwitchStreamsText'
import { queryTwitchStreamsAction } from '@/actions/queryTwitchStreams/queryTwitchStreamsAction'
import { createCommandText } from '@/utils/createCommandText'
import { createDirectlyText } from '@/utils/createDirectlyText'

describe(`${queryTwitchStreamsAction.name} 指令`, () => {
  it('查詢直播頻道: [!！]$(直播|live)', () => {
    const commands = [
      createDirectlyText(queryTwitchStreamsText),
      createCommandText(queryTwitchStreamsText),
    ]

    for (const command of commands) {
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

      expect(command.exec('!直播 jump king')?.groups?.inputKeyword).toBe(
        'jump king',
      )
      expect(command.exec('!直播英雄')?.groups?.inputKeyword).toBe('英雄')
      expect(command.exec('!直播dota')?.groups?.inputKeyword).toBe('dota')
      expect(command.exec('!直播星海')?.groups?.inputKeyword).toBe('星海')
      expect(command.exec('!livesc')?.groups?.inputKeyword).toBe('sc')
      expect(command.exec('!livewow')?.groups?.inputKeyword).toBe('wow')
    }
  })
})
