import { LineContext, LineEvent } from 'bottender'
import { Action, Client, Props } from 'bottender/dist/types'
import { expectType } from '../tsd/expectType'

export type WithGroupProps<OwnMatchProps = {}> = {
  match?: { groups?: Partial<OwnMatchProps> }
}

export type LineAction<OwnProps = {}> = (
  context: LineContext,
  props: Props<Client, LineEvent> & OwnProps,
) => Promise<Action<Client, LineEvent> | undefined | void>

// it 可以返回 props.next
expectType<LineAction>(async (context, props) => {
  console.assert(context.sendFlex.call)
  return props.next
})

// it 可以有 OwnProps
expectType<
  LineAction<{
    ownProp1: { nestProp1: string }
    ownProp2: { nestProp2: string }
  }>
>(async (context, props) => {
  console.assert(props.ownProp1.nestProp1)
  console.assert(props.ownProp2.nestProp2)
})

// it 可以匹配 Match Groups 簡化寫法
expectType<
  LineAction<
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
