import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const queryWar3NewsCommandBubble = context =>
  createCommandHintBubble({
    commandLabel: '魔獸新聞',
    commandDescription: '各大網站魔獸相關新聞',
    commandText: '魔獸新聞',
    context,
  })
