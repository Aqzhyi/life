import replaceString from 'replace-string'

/**
 * 適合在 sendText(TemplateLiterals) 中，過濾每行前方的 Tab Spaces
 *
 * 這些 Tab Spaces 通常是 prettier 自動排版出來的
 */
export const replaceStringTabSpace = (text: string) =>
  replaceString(text, '  ', '')
