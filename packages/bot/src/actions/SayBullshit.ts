import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import fetch from 'node-fetch'
import replaceStrings from 'replace-string'
import { debugAPI } from '@/lib/debug/debugAPI'

export const DEFAULTS_TOPIC = '我的鹹魚'
export const DEFAULTS_MINLEN = 100

export const SayBullshit: LineAction<WithGroupProps<{
  topic: string
  minLen: string
}>> = async (context, props) => {
  const log = debugAPI.bot.extend('唬爛')
  const topic = props?.match?.groups?.topic || DEFAULTS_TOPIC
  const minLen = props?.match?.groups?.minLen
    ? Number(props?.match?.groups?.minLen)
    : DEFAULTS_MINLEN

  log(`topic = ${topic}`)
  log(`minLen = ${minLen}`)

  await fetch(
    'http://ec2-18-223-132-77.us-east-2.compute.amazonaws.com:10000/bullshit',
    {
      method: 'POST',
      body: JSON.stringify({ topic, minLen }),
      redirect: 'follow',
    },
  )
    .then(res => res.text())
    .then(text => {
      context.sendText(
        replaceStrings(replaceStrings(text, '&nbsp;', ''), '<br>', ''),
      )
    })
    .catch(error => {
      context.sendText(error.message)
    })
}
