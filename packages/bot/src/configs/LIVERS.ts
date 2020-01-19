import { sortBy } from 'lodash'

type Name = string
type Data = {
  twitch: {
    id: string
    login: string
  }
  votes: number
}

const livers: [Name, Data][] = sortBy(
  [
    [
      'SEN',
      {
        twitch: {
          id: '9622576',
          login: 'rrb115',
        },
        votes: 0,
      },
    ],
    [
      '阿吉',
      {
        twitch: {
          id: '20633139',
          login: 'witness1129',
        },
        votes: 0,
      },
    ],
    [
      '輝哥',
      {
        twitch: {
          id: '15409117',
          login: 'wayne379',
        },
        votes: 0,
      },
    ],
  ],
  item => item[1].votes,
)

/**
 * 直播主
 *
 * 依 votes 排序
 */
export const LIVERS = {
  data: new Map<Name, Data>(livers),
  getIds() {
    return livers.map(item => item[1].twitch.id)
  },
}
