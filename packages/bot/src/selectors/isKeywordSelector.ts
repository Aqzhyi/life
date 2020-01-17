import { GAME_KEYWORDS, GameKeyword } from '../configs/GAME_CONFIGS'

export const isKeywordSelector = (value: string): value is GameKeyword => {
  return GAME_KEYWORDS.includes(value.toLowerCase() as GameKeyword)
}
