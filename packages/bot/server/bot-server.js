const bodyParser = require('body-parser')
const { bottender } = require('bottender')
const express = require('express')

const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5000

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

  server.get('/api', (req, res) => {
    res.json({ ok: true })
  })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> bottender Server Ready on http://localhost:${port}`)
  })
})
