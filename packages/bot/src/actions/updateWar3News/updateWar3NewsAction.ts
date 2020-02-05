import { LineAction } from '@/lib/bottender-toolkit/types'
import { newsAPI } from '@/lib/news/newsAPI'
import { updateWar3NewsGA } from '@/actions/updateWar3News/updateWar3NewsGA'

export const updateWar3NewsAction: LineAction = async (context, props) => {
  updateWar3NewsGA.onGoing()
  await newsAPI.crawlAll()
  return props.next
}
