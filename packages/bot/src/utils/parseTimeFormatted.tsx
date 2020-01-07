import dayjs, { UnitType } from 'dayjs'

/**
 * input: 3h or 3m or 3s
 */
export const parseTimeFormatted = (inputString: string) => {
  const pending = [
    (/\d+/i.exec(inputString) || [])[0],
    (/[smh]/i.exec(inputString) || [])[0],
  ] as [string, UnitType]

  const nowTime = dayjs()
  const remindAt = dayjs().add(Number(pending[0]), pending[1])

  return {
    nowTime,
    remindAt,
  }
}
