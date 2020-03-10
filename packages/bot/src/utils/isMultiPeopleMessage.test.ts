import { isMultiPeopleMessage } from '@/utils/isMultiPeopleMessage'
import { ContextSimulator } from 'bottender/test-utils'

describe(isMultiPeopleMessage.name, () => {
  const simulator = new ContextSimulator({ platform: 'line' })

  it('LineContext Group 和 Room 將視為多人對話', () => {
    const contextNative = simulator.createTextContext()
    const contextMultiPeopleMessage1 = {
      event: {
        isMessage: true,
        isText: true,
        source: {
          type: 'group',
        },
      },
    }
    const contextMultiPeopleMessage2 = {
      event: {
        isMessage: true,
        isText: true,
        source: {
          type: 'room',
        },
      },
    }

    expect(isMultiPeopleMessage(contextNative)).toBe(false)
    expect(isMultiPeopleMessage(contextMultiPeopleMessage1 as any)).toBe(true)
    expect(isMultiPeopleMessage(contextMultiPeopleMessage2 as any)).toBe(true)
  })
})
