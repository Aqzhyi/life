/**
 * 為正規指令加上例如 [!！] 的前綴符號，使 BOT 適合在群組內使用
 */
export const createCommandText = (commandText: string) => {
  return new RegExp(`^[!！]${commandText}`, 'i')
}
