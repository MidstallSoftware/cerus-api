import { NextFunction, Request, Response } from 'express'
import { HttpError, HttpNotFoundError } from '../exceptions'
import config from '../../config'
import winston from '../../providers/winston'

export function notFoundHandler(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) next(new HttpNotFoundError())
  else next()
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    const response: Record<string, number | string | string[]> = {
      status: 500,
      detail: 'Internal server error',
    }

    if (err instanceof HttpError) {
      Object.assign(response, err.toJSON())
    } else {
      response.detail = err.message
      winston.error(err)

      if (!config.production && typeof err.stack === 'string')
        response.trace = err.stack.split('\n')
    }

    res.status(response.status as number).json(response)
  }
  next()
}
