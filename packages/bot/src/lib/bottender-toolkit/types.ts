import {
  LineContext,
  LineEvent,
  TelegramContext,
  TelegramEvent,
} from 'bottender'
import { Action, Client, Props } from 'bottender/dist/types'
import { expectType } from '../tsd/expectType'
import { isLineContext } from '@/lib/bottender-toolkit/utils/isLineContext'
import { isTelegramContext } from '@/lib/bottender-toolkit/utils/isTelegramContext'

export type WithGroupProps<OwnMatchProps = {}> = {
  match?: { groups?: Partial<OwnMatchProps> }
}

export type BottenderAction<OwnProps = {}> = (
  context: LineContext | TelegramContext,
  props: Props<Client, LineEvent | TelegramEvent> & OwnProps,
) => Promise<Action<Client, LineEvent> | undefined | void>

// it 可以返回 props.next
expectType<BottenderAction>(async (context, props) => {
  if (isLineContext(context)) {
    console.assert(context.sendFlex.call)
  } else if (isTelegramContext(context)) {
    console.assert(context.sendMessage.call)
  }
  return props.next
})

// it 可以有 OwnProps
expectType<
  BottenderAction<{
    ownProp1: { nestProp1: string }
    ownProp2: { nestProp2: string }
  }>
>(async (context, props) => {
  console.assert(props.ownProp1.nestProp1)
  console.assert(props.ownProp2.nestProp2)
})

// it 可以匹配 Match Groups 簡化寫法
expectType<
  BottenderAction<
    {
      ownProp1: { nestProp1: string }
      ownProp2: { nestProp2: string }
    } & WithGroupProps<{
      command: string
    }>
  >
>(async (context, props) => {
  console.assert(props.match?.groups?.command)
  console.assert(props.ownProp1.nestProp1)
  console.assert(props.ownProp2.nestProp2)
})
