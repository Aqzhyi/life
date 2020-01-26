import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { range } from 'lodash'
import { HelixGame } from 'twitch'

export const createMockAPI = {
  helix: {
    games: {
      getGameByName: () => {
        twitchAPI.helix.games.getGameByName = jest
          .fn()
          .mockImplementation(() => {
            return Promise.resolve({
              data: {
                id: '512070',
                name: 'Jump King',
                boxArtUrl:
                  'https://static-cdn.jtvnw.net/ttv-boxart/Jump%20King-{width}x{height}.jpg',
              } as HelixGame,
            })
          })
      },
    },
  },
  getTopGames: (expectFlexTimes: number) => {
    twitchAPI.helix.games.getTopGames = jest.fn().mockImplementation(() => {
      const returnValue = [
        {
          boxArtUrl:
            'https://static-cdn.jtvnw.net/ttv-boxart/Jump%20King-{width}x{height}.jpg',
          id: '509658',
          name: 'Just Chatting',
        },
      ]

      range(1, expectFlexTimes * 10).forEach(() => {
        returnValue.push(returnValue[0])
      })

      return Promise.resolve({
        data: returnValue,
      })
    })
  },
}
