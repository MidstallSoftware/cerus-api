import { NextFunction, Request, Response } from 'express'
import { BaseMessage } from '../../message'
import { HttpUnauthorizedError } from '../../exceptions'
import ac from '../../../rbac/sys'

export default function genController(): Record<
  string,
  (req: Request, res: Response, next: NextFunction) => void
> {
  return {
    get: (req, res, next) => {
      try {
        if (typeof req.auth !== 'object')
          throw new Error('Unable to retreive auth')
        if (typeof req.auth.user !== 'object')
          throw new Error('Unable to retreive user')

        const perm = ac.can(req.auth.user.type).readOwn('user')

        if (perm.granted) {
          res.json(new BaseMessage(req.auth.user.transform(), 'user:get'))
          next()
        } else {
          throw new HttpUnauthorizedError(
            'User does not have permission to retrive user'
          )
        }
      } catch (e) {
        next(e)
      }
    },
  }
}
