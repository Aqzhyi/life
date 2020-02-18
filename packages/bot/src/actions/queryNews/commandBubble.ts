import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const queryNewsCommandBubble = context => [
  createCommandHintBubble({
    commandLabel: '{關鍵字}新聞',
    commandDescription: '顯示相關新聞',
    commandText: 'MSI新聞',
    context,
  }),
  createCommandHintBubble({
    commandLabel: '{關鍵字}新聞 更新',
    commandDescription: '抓取最新新聞',
    commandText: 'MSI新聞 更新',
    context,
  }),
]
