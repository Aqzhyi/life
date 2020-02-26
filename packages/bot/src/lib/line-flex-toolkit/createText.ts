import {
  FlexMargin,
  FlexSize,
  FlexWeight,
  FlexTextStyle,
  FlexDecoration,
  FlexPosition,
  FlexAlign,
  FlexGravity,
} from './enums'

export const createText = (options: {
  flex?: number
  margin?: FlexMargin | string
  text: string
  size?: FlexSize | string
  /** #RRGGBB or #RRGGBBAA */
  color?: string
  weight?: FlexWeight | string
  style?: FlexTextStyle | string
  decoration?: FlexDecoration | string
  position?: FlexPosition | string
  align?: FlexAlign | string
  gravity?: FlexGravity | string
  wrap?: boolean
  maxLines?: any
  action?: object
}) => {
  return {
    type: 'text',
    ...options,
  }
}
