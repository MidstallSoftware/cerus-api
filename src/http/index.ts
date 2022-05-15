import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import express from 'express'
import expressWS from 'express-ws'
import config from '../config'
import { errorHandler, notFoundHandler } from './middleware/error'
import v1 from './v1'
import logger from './middleware/logger'
import { postMetricHandler, preMetricHandler } from './middleware/metrics'

export default function () {
  const app = express()
  const websocket = expressWS(app)

  if (!config.disabled.sentry) {
    Sentry.init({
      dsn: process.env.SENTRY_HTTP_DSN,
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
      ],
      tracesSampleRate: 1.0,
    })
  }

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
  app.use(preMetricHandler)
  app.use(logger)

  app.use('/v1', v1())

  app.use(notFoundHandler)
  app.use(Sentry.Handlers.errorHandler())
  app.use(errorHandler)
  app.use(postMetricHandler)
  return { app, websocket }
}
