import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { queryNewsGA } from '@/actions/queryNews/ga'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import dayjs from 'dayjs'
import { newsModelAPI } from '@/lib/mongodb/models/newsModelAPI'
import { debugAPI } from '@/lib/debugAPI'
import { NewsDoc } from '@/lib/mongodb/models/news'
import { sendFlex } from '@/lib/bottender-toolkit/sendFlex'
import { createText } from '@/lib/line-flex-toolkit/createText'

export const queryNewsAction: BottenderAction<WithGroupProps<{
  keyword: string
}>> = async (context, props) => {
  const log = debugAPI.bot.extend('新聞')
  const keyword = props.match?.groups?.keyword?.trim() || ''

  /** 命令其不允許使用 DB 快取，而是連線到外部，重新獲取最新資源 */
  const nocacheOrder = /\s更新$/.test(context.event.text)

  try {
    log(`關鍵字=${keyword} 更新=${nocacheOrder}`)

    if (!keyword) {
      await context.sendText('🛑請輸入關鍵字查詢')
    }

    queryNewsGA.onQuery(keyword)
    let data: NewsDoc[]
    data = await newsModelAPI.getList({ keyword })

    if (
      nocacheOrder ||
      data.length < 10 ||
      (keyword && !data.length) ||
      dayjs(data[0].postedAt).isBefore(dayjs().subtract(1, 'day'))
    ) {
      log('連線到外部更新新聞快取')
      await newsModelAPI.crawlAll(keyword)
    } else {
      log('目前不需要獲取外部新聞資源')
    }

    data = await newsModelAPI.getList({ keyword })
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
      await sendFlex(
        context,
        {
          alt: `${keyword}新聞`,
          bubbles: [
            ...(data.map(item =>
              createSmallCardBubble({
                coverUrl: item.coverUrl,
                link: item.linkUrl,
                contents: [
                  createText({
                    text: dayjs(item.postedAt).format('@YYYY/MM/DD'),
                    size: 'xxs',
                    color: '#cccccc',
                  }),
                  createText({
                    text: item.provider,
                    size: 'xxs',
                    color: '#cccccc',
                  }),
                ],
                title: item.title,
              }),
            ) as any),
          ],
        },
        { preset: 'LINE_CAROUSEL' },
      )
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
