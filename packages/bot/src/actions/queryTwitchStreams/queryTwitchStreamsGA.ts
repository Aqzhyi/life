import { gaAPI } from '@/lib/google-analytics/gaAPI'
import { EventCategory } from '@/lib/google-analytics/EventCategory'
import { LineContext } from 'bottender'
import { queryTwitchStreamsAction } from '@/actions/queryTwitchStreams/queryTwitchStreamsAction'
import { HelixStream } from 'twitch'

export const useQueryTwitchStreamsGA = (context: LineContext) => {
  const events = {
    onQuery: async (gameTitle: string) => {
      const user = await context.getUserProfile()
      if (user?.displayName) {
        gaAPI.send({
          ec: EventCategory.LINEBOT,
          ea: `直播頻道/${gameTitle}/查詢`,
          el: {
            functionName: queryTwitchStreamsAction.name,
            displayName: user?.displayName,
            statusMessage: user?.statusMessage,
          },
          ev: 10,
        })
      }
    },
    onSentStreams: async (gameTitle: string, sentStreams: HelixStream[]) => {
      const sendUsersName = sentStreams
        .map(item => item.userDisplayName)
        .join(',')
      gaAPI.send({
        ec: EventCategory.LINEBOT,
        ea: `直播頻道/${gameTitle}/查詢/回應`,
        el: sendUsersName,
        ev: sendUsersName.length,
      })
    },
    onNoResult: async (gameTitle: string) => {
      gaAPI.send({
        ec: EventCategory.LINEBOT,
        ea: `直播頻道/${gameTitle}/查詢/無結果`,
        el: gameTitle,
      })
    },
    onError: async (data: {
      context: string
      errorMessage: string
      gameTitle: string
    }) => {
      const user = await context.getUserProfile()
      gaAPI.send({
        ec: EventCategory.LINEBOT,
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
