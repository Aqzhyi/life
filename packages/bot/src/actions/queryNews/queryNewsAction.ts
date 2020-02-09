import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { queryNewsGA } from '@/actions/queryNews/queryNewsGA'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import dayjs from 'dayjs'
import { newsAPI } from '@/lib/news/newsAPI'
import { debugAPI } from '@/lib/debug/debugAPI'

export const queryNewsAction: LineAction<WithGroupProps<{
  keyword
}>> = async (context, props) => {
  const log = debugAPI.bot.extend('新聞')
  const keyword = props.match?.groups?.keyword?.trim() || ''

  try {
    log(`關鍵字=${keyword}`)

    if (!keyword) {
      await context.sendText('🛑請輸入關鍵字查詢')
    }

    queryNewsGA.onQuery(keyword)
    let data: NewsDoc[]
    data = await newsAPI.getList({ keyword, pageCount: 10 })

    if (
      (keyword && !data.length) ||
      dayjs(data[0].postedAt).isAfter(dayjs().subtract(1, 'day'))
    ) {
      log('連線到外部更新新聞快取')
      await newsAPI.crawlAll(keyword)
    } else {
      log('不需要從外部新聞資源')
    }

    data = await newsAPI.getList({ keyword, pageCount: 10 })
    log('取得快取資料', data)

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
    queryNewsGA.onResponsed(keyword, data)
  } catch (error) {
    queryNewsGA.onError(keyword, error)
    await context.sendText(error.message)
  }

  return props.next
}
