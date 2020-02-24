import { FlexMargin } from './enums'

export const createSeparator = (options: {
  margin?: FlexMargin | string
  /** #RRGGBB or #RRGGBBAA */
  color?: string
}) => {
  return {
    type: 'separator',
    ...options,
  }
}
