export const createButton = (options: {
  action: {
    uri: string
    label: string
  }
  flex?: number
  position?: 'relative' | 'absolute'
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  height?: 'sm' | 'md'
  style?: 'link' | 'primary' | 'secondary'
  /** #RRGGBB or #RRGGBBAA */
  color?: string
  gravity?: 'top' | 'bottom' | 'center'
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
