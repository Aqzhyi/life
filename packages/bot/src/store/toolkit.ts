import { RootState } from '@/store/RootState'
import { Context } from 'bottender'
import { produce } from 'immer'

/**
 * Typed state
 */
export const getState = (context: Context<any, any>) => {
  return context.state as RootState
}

/**
 * Set state in mutable way
 */
export const setState = (
  context: Context<any, any>,
  state: (rootState: Partial<RootState>) => void,
): ReturnType<typeof context.setState> => {
  if (typeof state === 'function') {
    const getStateByCallback = produce(state)
    context.setState(getStateByCallback(context.state))
  } else {
    console.error('pass a Callback Function to set state in mutable way')
  }
}
