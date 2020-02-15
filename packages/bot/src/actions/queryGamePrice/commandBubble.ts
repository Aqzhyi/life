import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'
import { LineContext } from 'bottender'

export const queryGamePriceCommandBubble = (context: LineContext) =>
  createCommandHintBubble({
    commandLabel: '遊戲售價{遊戲}',
    commandDescription: '查詢遊戲在 Steam 或其它平台的歷史折扣',
    commandText: '遊戲售價 Detention',
    context,
  })
