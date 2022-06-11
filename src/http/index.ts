import express from 'express'
import expressWS from 'express-ws'
import serverTiming from 'server-timing'
import { errorHandler, notFoundHandler } from './middleware/error'
import v1 from './v1'
import logger from './middleware/logger'
import { postMetricHandler, preMetricHandler } from './middleware/metrics'

export default function () {
  const app = express()
  const websocket = expressWS(app)

  app.use(serverTiming)
  app.use(preMetricHandler)
  app.use(logger)

  app.use('/v1', v1())

  app.use(notFoundHandler)
  app.use(errorHandler)
  app.use(postMetricHandler)
  return { app, websocket }
}
