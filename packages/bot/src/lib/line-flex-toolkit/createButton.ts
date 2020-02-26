import {
  FlexPosition,
  FlexMargin,
  FlexHeight,
  FlexGravity,
  FlexButtonStyle,
} from './enums'

export const createButton = (options: {
  action: {
    uri: string
    label: string
  }
  flex?: number
  position?: FlexPosition | string
  margin?: FlexMargin | string
  height?: FlexHeight | string
  style?: FlexButtonStyle | string
  /** #RRGGBB or #RRGGBBAA */
  color?: string
  gravity?: FlexGravity | string
}) => {
  return {
    type: 'button',
    ...options,
    action: {
      type: 'uri',
      ...options.action,
    },
  }
}
