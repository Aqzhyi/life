import bodyParser from 'body-parser'
import { bottender } from 'bottender'
import express from 'express'

const isProd = process.env.NODE_ENV === 'production'

const app = bottender({ dev: !isProd })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  server.use(
    bodyParser.json({
      verify: (req, _, buf) => {
        req['rawBody'] = buf.toString()
      },
    }),
  )

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(5000, err => {
    if (err) throw err
    console.log(`> bottender Server Ready on http://localhost:${5000}`)
  })
})
