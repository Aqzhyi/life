import { GAME_CONFIGS, GameKeyword } from '@/configs/GAME_CONFIGS'
import { TwitchGameId } from '@/enums/TwitchGameId'

export const twitchGameSelector = (
  keyword: GameKeyword,
): {
  id: TwitchGameId
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
