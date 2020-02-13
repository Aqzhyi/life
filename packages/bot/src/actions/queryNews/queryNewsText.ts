/** 截取新聞關鍵字 */
export const queryWar3NewsText = '(?<keyword>[\\s\\S]+)\\s?新聞'
/** 確認「更新」模式 */
export const queryNewsNoCacheText = `${queryWar3NewsText}(\\s?(更新))`
