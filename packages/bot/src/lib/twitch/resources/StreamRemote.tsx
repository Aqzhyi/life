import { GameID } from '../enums/GameID'

export interface StreamRemote {
  /** e.g. `'36655187520'` */
  id: string
  /** e.g. `'22523901'` */
  userId: string
  /** e.g. `'lnclnerator'` */
  userName: string
  /** enum GameID */
  gameId: GameID
  /** e.g. `'live'` */
  type: 'live' | string
  /** e.g. `'WAR3 REFORGED!  FFAs and Trying to Get Level 6 Heroes --- Weekend Replays !keyboard'` */
  title: string
  /** e.g. `45` */
  viewerCount: number
  /** ISO8601 formatted string. e.g. `'2020-01-13T04:51:53Z'` */
  startedAt: string
  /** e.g. `'zh'` */
  language: string
  /** e.g. `'https://static-cdn.jtvnw.net/previews-ttv/live_user_lnclnerator-{width}x{height}.jpg'` */
  thumbnailUrl: string
  /** e.g. `['74c92063-a389-4fd2-8460-b1bb82b04ec7']` */
  tagIds: [string]
}
