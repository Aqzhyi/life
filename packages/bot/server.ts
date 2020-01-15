import bodyParser from 'body-parser'
import express from 'express'
import { bottender } from 'bottender'

const app = bottender({
  dev: process.env.NODE_ENV !== 'production',
})

const port = Number(process.env.PORT) || 5000

const handle = app.getRequestHandler()

console.info(`🔥 starting server on port: 5000`)

app.prepare().then(() => {
  const server = express()

  server.use(
    bodyParser.json({
      verify: (req, _, buf) => {
        req['rawBody'] = buf.toString()
      },
    }),
  )

  server.get('/', (req, res) => {
    res.send('works!!')
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
