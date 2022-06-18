import { NextFunction, Request, Response } from 'express'
import { BaseMessage } from '@cerusbots/common/dist/http/message'
import { EntityManager } from '@mikro-orm/mariadb'
import { HttpUnauthorizedError } from '../../exceptions'
import ac from '../../../rbac/sys'
import fetch from 'node-fetch'
import { APIUser } from 'discord-api-types/v9'
import { nowUTC } from '../../../utils'
import { DI } from '../../../di'

export default function genController(): Record<
  string,
  (req: Request, res: Response, next: NextFunction) => void
> {
  return {
    delete: (req, res, next) => {
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
          .then(async (discordUser: APIUser) => {
            if (typeof req.auth !== 'object')
              throw new Error('Unable to retreive auth')
            if (typeof req.auth.user !== 'object')
              throw new Error('Unable to retreive user')

            const em = DI.db.em.fork() as EntityManager

            req.auth.user.deletedAt = nowUTC()
            await em.persistAndFlush(req.auth.user)
            return {
              ...req.auth.user.transform(),
              email: discordUser.email,
              discordID: discordUser.id,
              username: discordUser.username,
              discriminator: discordUser.discriminator,
              avatarHash: discordUser.avatar,
            }
          })
          .then((data) => {
            res.json(new BaseMessage(data, 'user:delete'))
            next()
          })
          .catch((e) => next(e))
      } catch (e) {
        next(e)
      }
    },
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
                    avatarHash: discordUser.avatar,
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
