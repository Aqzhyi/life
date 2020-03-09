export const createText = (options: {
  flex?: number
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  text: string
  size?:
    | 'xxs'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | '3xl'
    | '4xl'
    | '5xl'
  /** #RRGGBB or #RRGGBBAA */
  color?: string
  weight?: 'regular' | 'bold'
  style?: 'normal' | 'italic'
  decoration?: 'none' | 'underline' | 'line-through'
  position?: 'relative' | 'absolute'
  align?: 'start' | 'end' | 'center'
  gravity?: 'top' | 'bottom' | 'center'
  wrap?: boolean
  maxLines?: any
  action?: object
}) => {
  return {
    type: 'text',
    ...options,
  }
}
