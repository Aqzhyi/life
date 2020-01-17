import { GAME_CONFIGS, GAME_KEYWORDS, GameKeyword } from './GAME_CONFIGS'

describe('GAME_KEYWORDS', () => {
  let keywords: string[] = []
  beforeEach(() => {
    for (const [config, ...rest] of GAME_CONFIGS) {
      keywords = [...keywords, ...rest]
    }
  })

  it('GAME_KEYWORDS 應等於 GAME_CONFIGS 所設定的關鍵字群', () => {
    expect(GAME_KEYWORDS).toStrictEqual(keywords)
  })
})
