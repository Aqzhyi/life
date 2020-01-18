/**
 * 將正規指令轉換成正規實例，適合用於用戶直接與 BOT 溝通
 */
export const createDirectlyText = (commandText: string) => {
  return new RegExp(`^[!！]?${commandText}`, 'i')
}
