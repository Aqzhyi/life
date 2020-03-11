import { appDiceCategoryAction } from '@/actions/appDice/categoryAction'
import { appDiceText } from '@/actions/appDice/text'

describe(`骰子功能：${appDiceCategoryAction.name}`, () => {
  it('正規表示法能正確判斷輸入命令', async done => {
    expect(appDiceText.exec('骰子關於項目 今天吃什麼')?.groups).toEqual({
      command: '關於',
      target: '項目',
      name: '今天吃什麼',
      description: undefined,
    })

    expect(appDiceText.exec('骰子新增項目 今天吃什麼')?.groups).toEqual({
      command: '新增',
      target: '項目',
      name: '今天吃什麼',
      description: undefined,
    })

    expect(
      appDiceText.exec('骰子新增項目 今天吃什麼 骰一個想吃的東西吧')?.groups,
    ).toEqual({
      command: '新增',
      target: '項目',
      name: '今天吃什麼',
      description: '骰一個想吃的東西吧',
    })

    done()
  })
})
