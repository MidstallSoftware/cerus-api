import { Request, Response, NextFunction } from 'express'
import { checkAccessToken } from '../../lib/accesstoken'
import { HttpUnauthorizedError } from '../exceptions'

export function requireAuthHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization

  if (typeof header === 'undefined') {
    next(new HttpUnauthorizedError('Not authorization header was given'))
  } else {
    const run = async () => {
      const accessToken = await checkAccessToken(header)
      res.locals.auth = { accessToken, user: accessToken.user }
    }
    run().catch((e) => next(e))
  }
}
