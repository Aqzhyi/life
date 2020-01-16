import express from 'express'
import next from 'next'
import { parse } from 'url'

const isProd = process.env.NODE_ENV === 'production'

const reactApp = next({ dev: !isProd })
const reactHandle = reactApp.getRequestHandler()

reactApp.prepare().then(() => {
  reactApp.prepare()
  const server = express()

  server.all('*', (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    return reactHandle(req, res, parsedUrl)
  })

  server.listen(3000, err => {
    if (err) throw err
    console.log(`> Next.js Server Ready on http://localhost:${3000}`)
  })
})
