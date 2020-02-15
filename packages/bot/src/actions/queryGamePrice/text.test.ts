import { queryGamePriceAction } from './action'
import { queryGamePriceText } from './text'
import { createDirectlyText } from '@/utils/createDirectlyText'
import { createCommandText } from '@/utils/createCommandText'

describe(`${queryGamePriceAction.name} 指令`, () => {
  it('能檢出關鍵字', () => {
    const commands = [
      createDirectlyText(queryGamePriceText),
      createCommandText(queryGamePriceText),
    ]

    for (const command of commands) {
      expect(command.exec('！遊戲售價')?.groups?.inputKeyword).toBe(undefined)
      expect(command.exec('！遊戲售價 billion')?.groups?.inputKeyword).toBe(
        'billion',
      )
      expect(command.exec('！遊戲售價billion')?.groups?.inputKeyword).toBe(
        'billion',
      )
      expect(command.exec('！遊戲售價部落与弯刀')?.groups?.inputKeyword).toBe(
        '部落与弯刀',
      )
      expect(command.exec('！遊戲售價 部落与弯刀')?.groups?.inputKeyword).toBe(
        '部落与弯刀',
      )
      expect(command.exec('！遊戲價格部落与弯刀')?.groups?.inputKeyword).toBe(
        '部落与弯刀',
      )
      expect(command.exec('！遊戲價格 部落与弯刀')?.groups?.inputKeyword).toBe(
        '部落与弯刀',
      )
      expect(command.exec('！遊戲折扣 部落与弯刀')?.groups?.inputKeyword).toBe(
        '部落与弯刀',
      )
    }
  })
})
