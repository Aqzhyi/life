import { LineAction, WithGroupProps } from '@/lib/bottender-toolkit/types'
import fetch from 'node-fetch'
import replaceStrings from 'replace-string'
import { debugAPI } from '@/lib/debug/debugAPI'
import { sayBullshitGA } from './ga'

export const DEFAULTS_TOPIC = '我的鹹魚'
export const DEFAULTS_MINLEN = 100

export const sayBullshitAction: LineAction<WithGroupProps<{
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

  sayBullshitGA.onQuery({
    topic,
    minLength: minLen,
  })

  await fetch('https://api.howtobullshit.me/bullshit', {
    method: 'POST',
    body: JSON.stringify({ topic, minLen }),
    redirect: 'follow',
  })
    .then(res => res.text())
    .then(text => {
      context.sendText(
        replaceStrings(replaceStrings(text, '&nbsp;', ''), '<br>', ''),
      )
    })
    .catch(error => {
      sayBullshitGA.onError({
        topic,
        minLength: minLen,
      })
      context.sendText(error.message)
    })
}
