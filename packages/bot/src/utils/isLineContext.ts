import { LineContext, Context } from 'bottender'
import { assertsLineContext } from '@/utils/assertsLineContext'

export const isLineContext = (
  context: Context<any, any>,
): context is LineContext => {
  try {
    assertsLineContext(context)
    return true
  } catch (error) {
    return false
  }
}
