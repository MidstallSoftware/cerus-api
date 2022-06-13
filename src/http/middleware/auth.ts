import deepmerge from 'deepmerge'
import { Request, Response, NextFunction } from 'express'
import { checkAccessToken } from '../../lib/accesstoken'
import { HttpUnauthorizedError } from '../exceptions'

interface AuthHandlerOptions {
  required?: boolean
}

export function authHandler(opts?: AuthHandlerOptions) {
  opts = deepmerge(opts || {}, {
    required: true,
  })
  return (req: Request, res: Response | null, next: NextFunction) => {
    const header = req.headers.authorization

    if (typeof header === 'undefined' && opts?.required) {
      next(new HttpUnauthorizedError('Not authorization header was given'))
    } else if (typeof header === 'string') {
      const run = async () => {
        if (res) res.startTime('auth', 'Authentication Timing')

        const accessToken = await checkAccessToken(header)
        req.auth = { accessToken, user: accessToken.user }

        if (res) res.endTime('auth')
        next()
      }
      run().catch((e) => next(e))
    } else {
      next()
    }
  }
}

export const requireAuthHandler = authHandler({ required: true })
