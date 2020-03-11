import { isMultiPeopleMessage } from '@/utils/isMultiPeopleMessage'
import { ContextMock } from '@/lib/bottender-toolkit/classes/ContextMock'

describe(isMultiPeopleMessage.name, () => {
  it('LineContext Group 和 Room 將視為多人對話', () => {
    const context = new ContextMock('some message').lineContext
    const contextMultiPeopleMessage1 = {
      sendFlex: jest.fn(),
      event: {
        isMessage: true,
        isText: true,
        source: {
          type: 'group',
        },
      },
    }
    const contextMultiPeopleMessage2 = {
      sendFlex: jest.fn(),
      event: {
        isMessage: true,
        isText: true,
        source: {
          type: 'room',
        },
      },
    }

    expect(isMultiPeopleMessage(context)).toBe(false)
    expect(isMultiPeopleMessage(contextMultiPeopleMessage1 as any)).toBe(true)
    expect(isMultiPeopleMessage(contextMultiPeopleMessage2 as any)).toBe(true)
  })
})
