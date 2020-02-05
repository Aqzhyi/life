import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'
import { getTopGames } from '@/lib/twitch/twitchAPI/getTopGames'

export const showTwitchTopGamesGA = {
  onQuery: () => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '遊戲/排行/查詢',
      el: '',
      ev: 1,
    })
  },
  onResponsed: (games: ThenArg<typeof getTopGames>) => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '遊戲/排行/查詢/回應',
      el: games.join(','),
      ev: 0,
    })
  },
  onError: (error: Error) => {
    gaAPI.send({
      ec: EventCategory.LINEBOT,
      ea: '遊戲/排行/查詢/錯誤',
      el: `error.message=${error.message}`,
      ev: 0,
    })
  },
}
