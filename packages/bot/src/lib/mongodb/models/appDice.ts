import mongoose, { Document } from 'mongoose'

/** 供隨機取出的子項目 */
export interface AppDiceSubDoc {
  name: string
  description?: string
}

/** 父層項目 */
export interface AppDiceDoc {
  name: string
  description?: string
  lineGroupId?: string
  subs: [AppDiceSubDoc]
}

export const AppDiceSubSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String, default: '' },
})

export const AppDiceSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String, default: '' },
  lineGroupId: { type: String, default: '' },
  subs: { type: [AppDiceSubSchema], default: [] },
})

export const AppDiceModel = mongoose.model<Document & AppDiceDoc>(
  'appDice',
  AppDiceSchema,
)
