import {
  FlexGravity,
  FlexHeight,
  FlexMargin,
  FlexPosition,
  FlexStyle,
} from './types'
import { LineTypes } from 'bottender'

export const createButton = (options: {
  action: LineTypes.TemplateAction
  flex?: number
  position?: FlexPosition
  margin?: FlexMargin
  height?: FlexHeight
  style?: FlexStyle
  /** #RRGGBB or #RRGGBBAA */
  color?: string
  gravity?: FlexGravity
}) => {
  return {
    type: 'button',
    ...options,
    action: {
      ...options.action,
    },
  }
}
