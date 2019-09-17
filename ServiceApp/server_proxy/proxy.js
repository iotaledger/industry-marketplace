import express from 'express'
import proxy from 'express-http-proxy'
const app = express()
app.use('/', proxy('http://service-requester.eu-central-1.elasticbeanstalk.com'))
export default app