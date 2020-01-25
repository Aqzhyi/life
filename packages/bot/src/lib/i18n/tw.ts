import { I18nKey } from './I18nKey'

export const tw: { [key in I18nKey]: string } = {
  'error/系統內部錯誤':
    '系統內部錯誤，如果你願意，可以通知開發者：hilezi.chen@gmail.com',
  'game/chatting': '純聊天',
  'game/cod': '決勝時刻16：現代戰爭',
  'game/csgo': '絕對武力：全球攻勢',
  'game/dota2': 'Dota 2',
  'game/hearthstone': '爐石戰記',
  'game/lol': '英雄聯盟',
  'game/minecraft': '創世神',
  'game/overwatch': '鬥陣特攻',
  'game/poe': '流亡黯道',
  'game/sc2': '星海爭霸2',
  'game/terraria': '泰拉瑞亞',
  'game/wc3': '魔獸爭霸3',
  'game/wow': '魔獸世界',
  'text/觀看人數': '人數: {{value}}',
  'text/開播時間': '開播於: {{value}}',
  'tip/正在查詢': '查詢中...',
  'validate/支援文字': '似乎沒有一款遊戲，匹配到你輸入的遊戲名稱「{{text}}」',
}
