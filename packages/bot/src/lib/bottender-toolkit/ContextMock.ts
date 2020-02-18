import { ContextSimulator } from 'bottender/test-utils'
import { LineContext } from 'bottender'

export class ContextMock {
  public context: LineContext
  constructor(
    userTextMessage = '',
    simulatorOptions: { platform: 'line' | 'telegram' },
  ) {
    const simulator = new ContextSimulator(simulatorOptions)
    const context = simulator.createTextContext(userTextMessage) as LineContext
    context.sendFlex = jest.fn()
    context.sendText = jest.fn()
    context.getUserProfile = jest.fn()

    this.context = context
  }
}
