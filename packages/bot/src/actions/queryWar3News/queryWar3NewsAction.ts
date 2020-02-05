import { LineAction } from '@/lib/bottender-toolkit/types'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { createStreamInfoBubble } from '@/lib/bottender-toolkit/templates/createCoverBubble'
import { queryWar3NewsGA } from '@/actions/queryWar3News/queryWar3NewsGA'

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
          createStreamInfoBubble({
            title: item.provider,
            subTitle: item.title,
            cover: {
              imageUrl: item.coverUrl,
              linkUrl: item.linkUrl,
            },
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
