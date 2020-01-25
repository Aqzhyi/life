/**
 * 最初設計目的用來建立一個 Quick Reply 的小文字按鈕
 */
export const createMessageSendButton = (props: {
  label: string
  text: string
}) => {
  return {
    type: 'button',
    style: 'primary',
    height: 'sm',
    action: {
      type: 'message',
      label: props.label,
      text: props.text,
    },
  }
}
