export interface GameRemote {
  /** e.g. `'31376'` */
  id: string
  /** e.g. `'Terraria'` */
  name: string
  /** e.g. `'https://static-cdn.jtvnw.net/ttv-boxart/Terraria-{width}x{height}.jpg'` */
  boxArtUrl: string
}
