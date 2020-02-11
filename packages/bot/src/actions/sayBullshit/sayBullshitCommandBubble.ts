import { createCommandHintBubble } from '@/lib/bottender-toolkit/templates/createCommandHintBubble'
import { DEFAULTS_MINLEN, DEFAULTS_TOPIC } from './sayBullshitAction'

export const sayBullshitCommandBubble = context =>
  createCommandHintBubble({
    commandLabel: `唬爛{主題} {長度=${DEFAULTS_MINLEN}}`,
    commandDescription: '講幹話',
    commandText: `唬爛${DEFAULTS_TOPIC} ${DEFAULTS_MINLEN}`,
    context,
  })
