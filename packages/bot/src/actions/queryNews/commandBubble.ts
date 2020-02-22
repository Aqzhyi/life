import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'

export const queryNewsCommandBubble = context => [
  createCommandHintBubble({
    commandLabel: '新聞{關鍵字}',
    commandDescription: '依關鍵字搜尋新聞',
    commandText: '新聞MSI',
    context,
  }),
  createCommandHintBubble({
    commandLabel: '新聞{關鍵字} 更新',
    commandDescription: '強制更新',
    commandText: '新聞MSI 更新',
    context,
  }),
]
