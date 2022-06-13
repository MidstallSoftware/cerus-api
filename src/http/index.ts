import express from 'express'
import expressWS from 'express-ws'
import serverTiming from 'server-timing'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import config from '../config'
import { errorHandler, notFoundHandler } from './middleware/error'
import v1 from './v1'
import logger from './middleware/logger'
import { postMetricHandler, preMetricHandler } from './middleware/metrics'

export default function () {
  const app = express()
  const websocket = expressWS(app)

  app.use(cors())

  if (!config.disabled.sentry) {
    Sentry.init({
      environment: config.env,
      dsn: process.env.SENTRY_LOGGER_DSN,
      debug: config.debug,
    })

    app.use(Sentry.Handlers.requestHandler())
  }

  app.use(
    serverTiming({
      enabled: config.debug,
    })
  )
  app.use(preMetricHandler)
  app.use(logger)

  app.use('/v1', v1())

  if (!config.disabled.sentry) {
    app.use(Sentry.Handlers.errorHandler())
  }

  app.use(notFoundHandler)
  app.use(errorHandler)
  app.use(postMetricHandler)
  return { app, websocket }
}
