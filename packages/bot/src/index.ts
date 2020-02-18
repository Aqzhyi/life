import { queryTwitchStreamsAction } from '@/actions/queryTwitchStreams/action'
import { LineContext, chain } from 'bottender'
import { router, text, platform } from 'bottender/dist/router'
import { queryTwitchStreamsText } from '@/actions/queryTwitchStreams/text'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { recordUserSayingAction } from '@/actions/recordUserSaying/action'
import { sayHiAction } from '@/actions/sayHi/action'
import { createDirectlyText } from '@/utils/createDirectlyText'
import { queryCalendarEventsAction } from '@/actions/queryCalendarEvents/action'
import { showTwitchTopGamesAction } from '@/actions/showTwitchTopGames/action'
import { sayBullshitAction } from '@/actions/sayBullshit/action'
import { sayBullshitText } from '@/actions/sayBullshit/text'
import { queryNewsAction } from '@/actions/queryNews/action'
import { createUniversalText } from '@/utils/createUniversalText'
import { showTwitchTopGamesText } from '@/actions/showTwitchTopGames/text'
import { queryWar3NewsText } from '@/actions/queryNews/text'
import { queryGamePriceAction } from '@/actions/queryGamePrice/action'
import { queryGamePriceText } from '@/actions/queryGamePrice/text'
import mongoose from 'mongoose'
import { debugAPI } from '@/lib/debug/debugAPI'

export default async function App(context: LineContext): Promise<unknown> {
  await i18nAPI.init()

  debugAPI.mongoDB('⚡️ Connecting...')
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  return chain([
    recordUserSayingAction,
    async () => {
      mongoose.connection.close()
      debugAPI.mongoDB('⚡️ Closed')
    },
  ] as any)
}
