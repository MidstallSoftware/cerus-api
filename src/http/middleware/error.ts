import { Request, Response, NextFunction } from 'express'
import { HttpError, HttpNotFoundError } from '../exceptions'

export function notFoundHandler(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new HttpNotFoundError())
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  const response = {
    status: 500,
    detail: 'Internal server error',
  }

  if (err instanceof HttpError) {
    Object.assign(response, err.toJSON())
  } else {
    response.detail = err.message
  }

  res.status(response.status).json(response)
  next()
}
