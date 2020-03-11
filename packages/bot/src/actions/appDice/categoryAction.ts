import { BottenderAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import { AppDiceModel } from '@/lib/mongodb/models/appDice'
import { debugAPI } from '@/lib/debugAPI'
import { isMultiPeopleMessage } from '@/utils/isMultiPeopleMessage'

type ActionCommand = '關於' | '新增' | '修改' | '刪除'
type ActionTarget = '項目' | '子項'

export const appDiceCategoryAction: BottenderAction<WithGroupProps<{
  command: ActionCommand
  description: string
  name: string
  target: ActionTarget
}>> = async (context, props) => {
  const logBase = debugAPI.bot.extend(appDiceCategoryAction.name)
  const command: ActionCommand = props.match?.groups?.command || '關於'
  const name: string = props.match?.groups?.name || ''
  const description: string = props.match?.groups?.name || ''
  const lineGroupId: string =
    context.event.rawEvent?.source?.groupId ||
    context.event.rawEvent?.source?.roomId ||
    ''
  const target: ActionTarget = props.match?.groups?.target || '項目'

  const isRoomMessage: boolean =
    isMultiPeopleMessage(context) && Boolean(lineGroupId)

  logBase(`[指令]${command}、[目標]${target}、[是群組訊息]${isRoomMessage}`)

  if (!isRoomMessage || !name || !command || !lineGroupId || !target) {
    return props.next
  }

  try {
    switch (command) {
      case '新增': {
        const exists = !!(await AppDiceModel.findOne({
          name,
          description,
        }))

        if (exists) {
          await context.sendText(`${target} ${name} 已經存在!`)
        } else {
          const doc = await new AppDiceModel({
            name,
            description,
            lineGroupId,
          }).save()

          await context.sendText(
            `${target} ${name} 已建立! ${JSON.stringify(doc)}`,
          )
        }
        break
      }

      case '關於': {
        const doc = await AppDiceModel.findOne({ name, lineGroupId })
        await context.sendText(`View! ${doc}`)
        break
      }

      case '刪除': {
        const doc = await AppDiceModel.deleteOne({ name, lineGroupId })
        await context.sendText(`Delete! ${JSON.stringify(doc)}`)
        break
      }

      default:
        break
    }
  } catch (error) {
    await context.sendText(error.message)
  }

  return props.next
}
