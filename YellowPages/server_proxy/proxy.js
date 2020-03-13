import express from 'express'
import proxy from 'express-http-proxy'
const app = express()
app.use('/', proxy('http://192.168.1.1:4000/'))
export default app 