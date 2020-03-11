import { assertsIsDefined } from './assertsIsDefined'

export const assertsIsDefinedGuard = <T>(value: T): value is NonNullable<T> => {
  try {
    assertsIsDefined(value)
    return true
  } catch (error) {
    return false
  }
}
