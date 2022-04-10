import express from 'express'
import { errorHandler, notFoundHandler } from './middleware/error'
import v1 from './v1'
import logger from './middleware/logger'

export default function () {
  const app = express()

  app.use(logger)

  app.use('/v1', v1())

  app.use(notFoundHandler)
  app.use(errorHandler)
  return app
}
