import { twitchAPI } from '../twitchAPI'
import { range } from 'lodash'

export const createMock = (expectFlexTimes: number) => {
  twitchAPI.getTopGames = jest
    .fn(twitchAPI.getTopGames)
    .mockImplementation(() => {
      const returnValue = [
        {
          coverUrl:
            'https://static-cdn.jtvnw.net/ttv-boxart/Just%20Chatting-640x360.jpg',
          id: '509658',
          name: 'Just Chatting',
        },
      ]

      range(1, expectFlexTimes * 10).forEach(() => {
        returnValue.push(returnValue[0])
      })

      return Promise.resolve(returnValue)
    })
}
