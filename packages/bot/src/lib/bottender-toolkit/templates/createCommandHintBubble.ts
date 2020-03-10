import { LineContext } from 'bottender'
import { isMultiPeopleMessage } from '@/utils/isMultiPeopleMessage'
import { createButton } from '@/lib/line-flex-toolkit/createButton'

/**
 * 適合用來建立「指令卡」讓使用者直接在私人對話，或群組對話之中按選
 */
export const createCommandHintBubble = (props: {
  /** 指令代碼 e.g. `'直播魔獸'` 幫使用者傳送此文字給機器人反應 */
  commandText: string
  /** 指令代碼含變量 e.g. `'直播{遊戲}'` 顯示給使用者查看 */
  commandLabel: string
  /** 指令描述 e.g. `'查詢流行遊戲'` 顯示給使用者查看 */
  commandDescription: string
  /** 用來判斷是否加上指令前輟 */
  context: LineContext
}) => {
  const object = {
    type: 'bubble',
    size: 'micro',
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
              size: 'xxs',
            },
            {
              type: 'text',
              text: props.commandLabel,
              color: '#ffffff',
              size: 'md',
              flex: 4,
              weight: 'bold',
              wrap: true,
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
              size: 'xxs',
            },
            {
              type: 'text',
              text: props.commandDescription,
              color: '#ffffff',
              size: 'md',
              flex: 4,
              weight: 'bold',
              wrap: true,
            },
          ],
        },
      ],
      paddingAll: '20px',
      backgroundColor: '#0367D3',
      spacing: 'md',
      paddingTop: '22px',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: '若在群組使用請加驚嘆號「！」',
          size: 'xxs',
          color: '#bbbbbb',
          wrap: true,
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [
        createButton({
          style: 'primary',
          height: 'sm',
          action: {
            type: 'message',
            label: '使用',
            text: isMultiPeopleMessage(props.context)
              ? `！${props.commandText}`
              : props.commandText,
          },
        }),
      ],
    },
  }

  return object
}
