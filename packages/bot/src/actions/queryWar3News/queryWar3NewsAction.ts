import { LineAction } from '@/lib/bottender-toolkit/types'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { queryWar3NewsGA } from '@/actions/queryWar3News/queryWar3NewsGA'
import { createSmallCardBubble } from '@/lib/bottender-toolkit/templates/createSmallCardBubble'
import dayjs from 'dayjs'

export const queryWar3NewsAction: LineAction = async (context, props) => {
  queryWar3NewsGA.onQuery()
  const data = (
    await firestoreAPI.db
      .collection('news')
      .orderBy('postedAt', 'desc')
      .limit(10)
      .get()
  ).docs.map(item => item.data()) as NewsDoc[]

  try {
    await context.sendFlex('魔獸新聞', {
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
    queryWar3NewsGA.onResponsed(data)
  } catch (error) {
    queryWar3NewsGA.onError(error)
    await context.sendText(error.message)
  }

  return props.next
}
