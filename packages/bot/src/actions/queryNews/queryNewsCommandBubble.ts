import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const queryNewsCommandBubble = context =>
  createCommandHintBubble({
    commandLabel: '{關鍵字}新聞',
    commandDescription: '遊戲媒體新聞',
    commandText: 'MSI新聞',
    context,
  })
