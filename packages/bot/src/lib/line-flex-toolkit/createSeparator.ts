import { FlexMargin } from '@/lib/line-flex-toolkit/types'

export const createSeparator = (options?: {
  margin?: FlexMargin
  /** #RRGGBB or #RRGGBBAA */
  color?: string
}) => {
  return {
    type: 'separator',
    ...options,
  }
}
