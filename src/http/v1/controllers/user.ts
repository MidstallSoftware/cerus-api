import { NextFunction, Request, Response } from 'express'
import { BaseMessage } from '@cerusbots/common/dist/http/message'
import { HttpUnauthorizedError } from '../../exceptions'
import ac from '../../../rbac/sys'
import fetch from 'node-fetch'
import { APIUser } from 'discord-api-types/v9'

export default function genController(): Record<
  string,
  (req: Request, res: Response, next: NextFunction) => void
> {
  return {
    get: (req, res, next) => {
      try {
        if (typeof req.auth !== 'object')
          throw new Error('Unable to retreive auth')
        if (typeof req.auth.accessToken !== 'object')
          throw new Error('Unable to retreive token')

        fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: req.auth.accessToken.token,
          },
        })
          .then((resp) => resp.json())
          .then((discordUser: APIUser) => {
            if (typeof req.auth !== 'object')
              throw new Error('Unable to retreive auth')
            if (typeof req.auth.user !== 'object')
              throw new Error('Unable to retreive user')

            const perm = ac.can(req.auth.user.type).readOwn('user')

            if (perm.granted) {
              res.json(
                new BaseMessage(
                  {
                    ...req.auth.user.transform(),
                    email: discordUser.email,
                    discordID: discordUser.id,
                    username: discordUser.username,
                    discriminator: discordUser.discriminator,
                  },
                  'user:get'
                )
              )
              next()
            } else {
              throw new HttpUnauthorizedError(
                'User does not have permission to retrive user'
              )
            }
          })
          .catch((error) => next(error))
      } catch (e) {
        next(e)
      }
    },
  }
}
