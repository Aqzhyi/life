declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'test' | 'production' | 'development'

    /** battle.net client_id */
    BNET_CLIENT_ID: string
    /** battle.net client_secret */
    BNET_CLIENT_SECRET: string
    /** twitch.tv client_id */
    TWITCH_CLIENT_ID: string

    /** 台灣星盟電子競技情報網 */
    GOOGLE_ANALYTICS_UA_ID: string
  }
}
