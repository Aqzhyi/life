import { gaAPI } from '@/lib/gaAPI'
import { LineContext, TelegramContext } from 'bottender'
import { queryTwitchStreamsAction } from '@/actions/queryTwitchStreams/action'
import { HelixStream } from 'twitch'
import { isLineContext } from '@/utils/isLineContext'

export const useQueryTwitchStreamsGA = async (
  context: LineContext | TelegramContext,
) => {
  const user = isLineContext(context)
    ? await context.getUserProfile()
    : {
        displayName: context.event.message.from.username,
      }

  const events = {
    onQuery: async (gameTitle: string) => {
      gaAPI.send({
        ec: gaAPI.EventCategory.LINEBOT,
        ea: `直播頻道/${gameTitle}/查詢`,
        el: {
          functionName: queryTwitchStreamsAction.name,
          displayName: user?.displayName,
          statusMessage: user?.statusMessage,
        },
        ev: 10,
      })
    },
    onResponsed: async (gameTitle: string, sentStreams: HelixStream[]) => {
      const sendUsersName = sentStreams
        .map(item => item.userDisplayName)
        .join(',')
      gaAPI.send({
        ec: gaAPI.EventCategory.LINEBOT,
        ea: `直播頻道/${gameTitle}/查詢/回應`,
        el: sendUsersName,
        ev: sendUsersName.length,
      })
    },
    onNoResult: async (gameTitle: string) => {
      gaAPI.send({
        ec: gaAPI.EventCategory.LINEBOT,
        ea: `直播頻道/${gameTitle}/查詢/無結果`,
        el: gameTitle,
      })
    },
    onError: async (data: {
      context: string
      errorMessage: string
      gameTitle: string
    }) => {
      gaAPI.send({
        ec: gaAPI.EventCategory.LINEBOT,
        ea: `直播頻道/${data.gameTitle}/查詢/錯誤`,
        el: {
          ...data,
          displayName: user?.displayName,
          statusMessage: user?.statusMessage,
        },
      })
    },
  }

  return events
}
