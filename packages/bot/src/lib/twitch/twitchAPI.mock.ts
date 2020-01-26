import { twitchAPI } from '@/lib/twitch/twitchAPI'
import { range } from 'lodash'

export const createMockAPI = {
  helix: {
    streams: {
      getStreams: () => {
        twitchAPI.helix.streams.getStreams = jest
          .fn()
          .mockImplementation(() => {
            const retrunValue = [
              {
                id: '36767489456',
                userId: '183295015',
                userName: 'RevolutionaryXGaming',
                gameId: '458781',
                type: 'live',
                title: "No Man's Sky on PS4 Pro",
                viewerCount: 32,
                startedAt: '2020-01-26T14:29:29Z',
                language: 'en',
                thumbnailUrl:
                  'https://static-cdn.jtvnw.net/previews-ttv/live_user_revolutionaryxgaming-{width}x{height}.jpg',
                tagIds: [
                  '6ea6bca4-4712-4ab9-a906-e3336a9d8039',
                  'ff56eeeb-99ed-4a60-93fc-0b3f05d8661e',
                  '67259b26-ff83-444e-9d3c-faab390df16f',
                ],
              },
            ]

            return Promise.resolve({
              data: retrunValue,
            })
          })
      },
    },
    games: {
      getGameByName: () => {
        twitchAPI.helix.games.getGameByName = jest
          .fn()
          .mockImplementation(() => {
            return Promise.resolve({
              id: '512070',
              name: '__MOCK__ Jump King',
              boxArtUrl:
                'https://static-cdn.jtvnw.net/ttv-boxart/Jump%20King-{width}x{height}.jpg',
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
