import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { queryNewsGA } from '@/actions/queryNews/queryNewsGA'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import dayjs from 'dayjs'
import { newsAPI } from '@/lib/news/newsAPI'
import { debugAPI } from '@/lib/debug/debugAPI'
import { queryNewsNoCacheText } from '@/actions/queryNews/queryNewsText'

export const queryNewsAction: LineAction<WithGroupProps<{
  keyword: string
}>> = async (context, props) => {
  const log = debugAPI.bot.extend('新聞')
  const keyword = props.match?.groups?.keyword?.trim() || ''

  /** 不使用 firestore 快取，而是連線到外部獲取最新資源 */
  const nocache = new RegExp(queryNewsNoCacheText).test(context.event.text)

  try {
    log(`關鍵字=${keyword} 更新=${nocache}`)

    if (!keyword) {
      await context.sendText('🛑請輸入關鍵字查詢')
    }

    queryNewsGA.onQuery(keyword)
    let data: NewsDoc[]
    data = await newsAPI.getList({ keyword, pageCount: 10 })

    if (
      nocache ||
      (keyword && !data.length) ||
      dayjs(data[0].postedAt).isAfter(dayjs().subtract(1, 'day'))
    ) {
      log('連線到外部更新新聞快取')
      await newsAPI.crawlAll(keyword)
    } else {
      log('目前不需要獲取外部新聞資源')
    }

    data = await newsAPI.getList({ keyword, pageCount: 10 })
    log(
      '取得快取資料',
      data.map(
        item =>
          `${item.title} ${item.provider}@${dayjs(item.postedAt).format(
            'MM/DD',
          )}`,
      ),
    )

    if (data.length) {
      await context.sendFlex(`${keyword}新聞`, {
        type: 'carousel',
        contents: [
          ...(data.map(item =>
            createSmallCardBubble({
              coverUrl: item.coverUrl,
              link: item.linkUrl,
              content: dayjs(item.postedAt).format('@YYYY/MM/DD'),
              title: item.title,
              subtitle: item.provider,
            }),
          ) as any),
        ],
      })
    } else {
      await context.sendText('沒有找到相關新聞')
    }
    queryNewsGA.onResponsed(keyword, data)
  } catch (error) {
    queryNewsGA.onError(keyword, error)
    await context.sendText(error.message)
  }

  return props.next
}
