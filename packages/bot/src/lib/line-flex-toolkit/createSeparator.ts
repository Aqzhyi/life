export const createSeparator = (options?: {
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  /** #RRGGBB or #RRGGBBAA */
  color?: string
}) => {
  return {
    type: 'separator',
    ...options,
  }
}
