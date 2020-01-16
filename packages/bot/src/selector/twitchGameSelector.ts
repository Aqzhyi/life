import { GAME_CONFIGS, GameKeyword } from '../constants/GAME_CONFIGS'
import { GameID } from '../lib/twitch/enums/GameID'

export const twitchGameSelector = (
  keyword: GameKeyword,
): {
  id: GameID
  title: string
} | null => {
  for (const gameConfigs of GAME_CONFIGS) {
    const [gameConfig, ...gameMatchTexts] = gameConfigs

    const gameKeywords = new Set(gameMatchTexts)

    if (gameKeywords.has(keyword)) {
      return {
        id: gameConfig.gameId,
        title: gameConfig.text(),
      }
    }
  }

  return null
}
