import { NextFunction, Request, Response } from 'express'
import winston from '../../providers/winston'
import { httpRequestMetric } from '../../metrics/http'

export function preMetricHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.metricsStart = Date.now()
  next()
}

export function postMetricHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const time = Date.now() - res.locals.metricsStart
  httpRequestMetric
    .labels({
      method: req.method,
      route: req.url,
      code: res.statusCode,
    })
    .observe(time)
  winston.debug(
    `Took ${time}ms to respond to ${req.socket.remoteAddress} for ${req.url} (${req.method})`
  )
  next()
}
