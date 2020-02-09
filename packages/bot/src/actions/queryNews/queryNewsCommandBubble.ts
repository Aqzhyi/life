import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const queryNewsCommandBubble = context =>
  createCommandHintBubble({
    commandLabel: '{關鍵字}新聞',
    commandDescription: '從遊戲媒體撈出新聞',
    commandText: '魔獸新聞',
    context,
  })
