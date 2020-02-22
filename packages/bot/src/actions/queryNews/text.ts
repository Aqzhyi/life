/** 截取新聞關鍵字 */
export const queryWar3NewsText = '新聞\\s?(?<keyword>.*)'
/** 確認「更新」模式 */
export const queryNewsNoCacheText = `${queryWar3NewsText} 更新`
