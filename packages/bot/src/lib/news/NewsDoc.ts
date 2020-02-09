export interface NewsDoc {
  /** 由 npm:uuid-by-string 生產 */
  _id: string
  /** ISO8601 format */
  postedAt: string
  title: string
  linkUrl: string
  provider: '巴哈姆特' | '4Gamers' | 'TESL'
  coverUrl: string
  tag: string[]
}
