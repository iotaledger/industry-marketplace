const { createServer } = require('http')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const port = parseInt(process.env.PORT, 10) || 3000

app.prepare().then(() => {
    createServer((req, res) => {
        handle(req, res)
    }).listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
