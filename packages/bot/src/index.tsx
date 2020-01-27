import { queryTwitchStreamsAction } from '@/actions/queryTwitchStreams/queryTwitchStreamsAction'
import { LineContext, chain } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { queryTwitchStreamsText } from '@/actions/queryTwitchStreams/queryTwitchStreamsText'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { recordUserSayingAction } from '@/actions/recordUserSaying/recordUserSayingAction'
import { sayHiAction } from '@/actions/sayHi/sayHiAction'
import { createDirectlyText } from '@/utils/createDirectlyText'
import { createCommandText } from '@/utils/createCommandText'
import { queryCalendarEventsAction } from '@/actions/queryCalendarEvents/queryCalendarEventsAction'
import { showTwitchTopGamesAction } from '@/actions/showTwitchTopGames/showTwitchTopGamesAction'
import { isMultiPeopleMessage } from '@/selectors/isMultiPeopleMessage'
import { sayBullshitAction } from '@/actions/sayBullshit/sayBullshitAction'

/**
 * 自動依「群組」或「私人」訊息，決定是否建立「！」驚嘆號關鍵字
 */
const createUniversalText = (
  context: LineContext,
  /** 此引數將傳入 RegExp 類別 */
  matchText: string,
) => {
  return isMultiPeopleMessage(context)
    ? createCommandText(matchText)
    : createDirectlyText(matchText)
}

export default async function App(context: LineContext): Promise<unknown> {
  await i18nAPI.init()

  return chain([
    recordUserSayingAction as any,
    router([
      text(
        createUniversalText(context, `唬爛(?<topic>.*?)(\\s(?<minLen>\\d+))?$`),
        sayBullshitAction as any,
      ),
      text(
        createUniversalText(context, '(直播|live)$'),
        showTwitchTopGamesAction as any,
      ),
      text(
        createDirectlyText('(LA|ＬＡ)日曆'),
        queryCalendarEventsAction as any,
      ),
      text(
        createUniversalText(context, queryTwitchStreamsText),
        queryTwitchStreamsAction as any,
      ),
      text(
        createUniversalText(context, `(?<text>[\\s\\S]+)`),
        sayHiAction as any,
      ),
    ]),
  ])
}
