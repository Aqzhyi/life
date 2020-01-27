import { QueryTwitchStreams } from '@/actions/QueryTwitchStreams'
import { LineContext, chain } from 'bottender'
import { router, text } from 'bottender/dist/router'
import { QueryTwitchStreamsText } from '@/configs/TEXT'
import { i18nAPI } from '@/lib/i18n/i18nAPI'
import { RecordUserSaying } from '@/actions/RecordUserSaying'
import { SayHelloWorld } from '@/actions/SayHelloWorld'
import { createDirectlyText } from '@/utils/createDirectlyText'
import { createCommandText } from '@/utils/createCommandText'
import { QueryCalendarEvents } from '@/actions/QueryCalendarEvents'
import { ShowTwitchTopGamesButton } from '@/actions/ShowTwitchTopGamesButton'
import { isMultiPeopleMessage } from '@/selectors/isMultiPeopleMessage'
import { SayBullshit } from '@/actions/SayBullshit'

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
    RecordUserSaying as any,
    router([
      text(
        createUniversalText(context, `唬爛(?<topic>.*?)(\\s(?<minLen>\\d+))?$`),
        SayBullshit as any,
      ),
      text(
        createUniversalText(context, '(直播|live)$'),
        ShowTwitchTopGamesButton as any,
      ),
      text(createDirectlyText('(LA|ＬＡ)日曆'), QueryCalendarEvents as any),
      text(
        createUniversalText(context, QueryTwitchStreamsText),
        QueryTwitchStreams as any,
      ),
      text(
        createUniversalText(context, `(?<text>[\\s\\S]+)`),
        SayHelloWorld as any,
      ),
    ]),
  ])
}
