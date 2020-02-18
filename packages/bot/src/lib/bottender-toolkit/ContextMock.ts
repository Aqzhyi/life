import { ContextSimulator } from 'bottender/test-utils'
import { LineContext, TelegramContext } from 'bottender'

export class ContextMock {
  private userTextMessage: string
  private _context?: LineContext & TelegramContext

  constructor(userTextMessage = '') {
    this.userTextMessage = userTextMessage
  }

  doMock() {
    if (!this._context) return

    this._context.sendFlex = jest.fn()
    this._context.sendText = jest.fn()
    this._context.sendMessage = jest.fn()
    this._context.getUserProfile = jest.fn()
  }

  createContext(platform: 'line' | 'telegram') {
    const simulator = new ContextSimulator({ platform })
    const context = simulator.createTextContext(this.userTextMessage)

    this._context = context
    this.doMock()
    return context
  }

  get lineContext(): LineContext {
    if (this._context) {
      return this._context
    }

    return this.createContext('line')
  }

  get telegramContext(): TelegramContext {
    if (this._context) {
      return this._context
    }

    return this.createContext('telegram')
  }
}
