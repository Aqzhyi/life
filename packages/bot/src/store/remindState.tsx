import { setState } from './toolkit'
import { Context } from 'bottender'
import { RootState } from './RootState'

export interface RemindState {
  /** ISO8601 format */
  remindAt: string
  /** to sendText */
  remindText: string
}

export const remindState = {
  add: (context: Context<any, any>, item: RemindState) => {
    setState(context, state => {
      state.reminds?.push(item)
    })
  },
  list: (context: Context<any, any>): RemindState[] => {
    const state = context.state as RootState
    return state.reminds
  },
}
