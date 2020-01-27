import { createMessageSendButton } from '@/lib/bottender-toolkit/templates/createMessageSendButton'
import { LineContext } from 'bottender'
import { isMultiPeopleMessage } from '@/selectors/isMultiPeopleMessage'

/**
 * 適合用來建立「指令卡」讓使用者直接在私人對話，或群組對話之中按選
 */
export const createCommandHintBubble = (props: {
  /** e.g. `'直播魔獸'` 幫使用者傳送此文字給機器人反應 */
  commandText: string
  /** e.g. `'直播{遊戲}'` 顯示給使用者查看 */
  commandLabel: string
  /** e.g. `'查詢流行遊戲'` 顯示給使用者查看 */
  commandDescription: string
  /** 用來判斷是否加上指令前輟 */
  context: LineContext
}) => {
  const object = {
    type: 'bubble',
    size: 'mega',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '指令',
              color: '#ffffff66',
              size: 'sm',
            },
            {
              type: 'text',
              text: props.commandLabel,
              color: '#ffffff',
              size: 'xl',
              flex: 4,
              weight: 'bold',
            },
          ],
        },
        {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '功能',
              color: '#ffffff66',
              size: 'sm',
            },
            {
              type: 'text',
              text: props.commandDescription,
              color: '#ffffff',
              size: 'xl',
              flex: 4,
              weight: 'bold',
            },
          ],
        },
      ],
      paddingAll: '20px',
      backgroundColor: '#0367D3',
      spacing: 'md',
      height: '154px',
      paddingTop: '22px',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '若在群組使用請加驚嘆號「！」',
          size: 'xs',
          color: '#bbbbbb',
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        createMessageSendButton({
          label: '指令',
          text: isMultiPeopleMessage(props.context)
            ? `！${props.commandText}`
            : props.commandText,
        }),
      ],
    },
  }

  return object
}
