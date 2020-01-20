import { google } from 'googleapis'
import dayjs from 'dayjs'

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
})

// TODO: access_token 也許會過期，如果發生過期，要用 refresh_token 去換新的
// 人工換 env by https://developers.google.com/oauthplayground/
// 文件 https://googleapis.dev/nodejs/googleapis/latest/calendar/index.html
oauth2Client.setCredentials({
  // eslint-disable-next-line @typescript-eslint/camelcase
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  // eslint-disable-next-line @typescript-eslint/camelcase
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
})

const calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client,
})

export const calendarAPI = {
  async getAfterTodayEvents() {
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_OWN_CALENDAR_ID,
    })

    const items = response.data.items?.filter(item => {
      if (item.start?.dateTime) {
        return dayjs(item.start.dateTime).isAfter(dayjs())
      } else if (item.start?.date) {
        return dayjs(item.start.date).isAfter(dayjs())
      } else {
        return false
      }
    })

    return items
  },
}
