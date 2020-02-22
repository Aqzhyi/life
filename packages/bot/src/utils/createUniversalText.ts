import { LineContext } from 'bottender'
import { isMultiPeopleMessage } from '@/lib/bottender-toolkit/utils/isMultiPeopleMessage'
import { createCommandText } from '@/utils/createCommandText'
import { createDirectlyText } from '@/utils/createDirectlyText'

/**
 * 自動依「群組」或「私人」訊息，決定是否建立「！」驚嘆號關鍵字
 */
export const createUniversalText = (
  context: LineContext,
  /** 此引數將傳入 RegExp 類別 */
  matchText: string,
) => {
  return isMultiPeopleMessage(context)
    ? createCommandText(matchText)
    : createDirectlyText(matchText)
}
