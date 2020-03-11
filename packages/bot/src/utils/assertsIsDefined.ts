import ow from 'ow'

export function assertsIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    ow(value, `${assertsIsDefined.name}(value)`, ow.nullOrUndefined.not)
  }
}
