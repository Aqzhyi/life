import { LineAction } from '@/lib/bottender-toolkit/types'
import { firestoreAPI } from '@/lib/firestore/firestoreAPI'
import { NewsDoc } from '@/lib/news/NewsDoc'
import { createStreamInfoBubble } from '@/lib/bottender-toolkit/templates/createCoverBubble'

export const queryWar3NewsAction: LineAction = async (context, props) => {
  const data = (
    await firestoreAPI.db
      .collection('news')
      .orderBy('postedAt', 'desc')
      .limit(10)
      .get()
  ).docs.map(item => item.data()) as NewsDoc[]

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

  return props.next
}
