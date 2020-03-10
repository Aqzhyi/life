import { gaAPI } from '@/lib/gaAPI'
import { HelixGame } from 'twitch'

export const showTwitchTopGamesGA = {
  onQuery: () => {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: '遊戲/排行/查詢',
      el: '',
      ev: 1,
    })
  },
  onResponsed: (games: HelixGame[]) => {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: '遊戲/排行/查詢/回應',
      el: games.map(item => item.name).join(', '),
      ev: 0,
    })
  },
  onError: (error: Error) => {
    gaAPI.send({
      ec: gaAPI.EventCategory.LINEBOT,
      ea: '遊戲/排行/查詢/錯誤',
      el: `error.message=${error.message}`,
      ev: 0,
    })
  },
}
