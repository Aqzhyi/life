import { LineContext } from 'bottender'

export const isMultiPeopleMessage = (context: LineContext): boolean => {
  const isMultiPeopleMessage: boolean = ['group', 'room'].includes(
    context?.event?.source?.type,
  )

  return isMultiPeopleMessage
}
