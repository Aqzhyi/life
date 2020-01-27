import { sayBullshitAction } from '@/actions/sayBullshit/sayBullshitAction'
import { createCommandText } from '@/utils/createCommandText'
import { sayBullshitText } from '@/actions/sayBullshit/sayBullshitText'

describe(`${sayBullshitAction.name} 指令正規`, () => {
  it('能匹配主題和產生文字長度', () => {
    const command = createCommandText(sayBullshitText)

    expect(command.test('！唬爛魔獸')).toBe(true)
    expect(command.test('！唬爛星海')).toBe(true)
    expect(command.test('！唬爛dota')).toBe(true)
    expect(command.test('！唬爛lol')).toBe(true)
    expect(command.test('！唬爛LOL')).toBe(true)
    expect(command.test('！唬爛WOW')).toBe(true)
    expect(command.test('！唬爛OW')).toBe(true)

    expect(command.exec('！唬爛我的鹹魚')?.groups?.topic).toBe('我的鹹魚')
    expect(command.exec('！唬爛我的鹹魚 100')?.groups?.minLen).toBe('100')
  })
})
