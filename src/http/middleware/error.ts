import { Request, Response, NextFunction } from 'express'
import { HttpError, HttpNotFoundError } from '../exceptions'
import config from '../../config'

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
    const response: Record<string, any> = {
      status: 500,
      detail: 'Internal server error',
    }

    if (err instanceof HttpError) {
      Object.assign(response, err.toJSON())
    } else {
      response.detail = err.message
      if (!config.production && typeof err.stack === 'string')
        response.trace = err.stack.split('\n')
    }

    res.status(response.status).json(response)
  }
  next()
}
