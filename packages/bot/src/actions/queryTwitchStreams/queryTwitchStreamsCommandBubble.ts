import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const queryTwitchStreamsCommandBubble = context =>
  createCommandHintBubble({
    commandLabel: '直播{遊戲}',
    commandDescription: '中文直播頻道',
    commandText: '直播魔獸',
    context,
  })
