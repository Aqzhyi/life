import {
  FlexSize,
  FlexMargin,
  FlexWeight,
  FlexTextStyle,
  FlexDecoration,
  FlexPosition,
  FlexAlign,
  FlexGravity,
} from '@/lib/line-flex-toolkit/types'

export const createText = (options: {
  flex?: number
  margin?: FlexMargin
  text: string
  size?: FlexSize
  /** #RRGGBB or #RRGGBBAA */
  color?: string
  weight?: FlexWeight
  style?: FlexTextStyle
  decoration?: FlexDecoration
  position?: FlexPosition
  align?: FlexAlign
  gravity?: FlexGravity
  wrap?: boolean
  maxLines?: any
  action?: object
}) => {
  return {
    type: 'text',
    ...options,
  }
}
