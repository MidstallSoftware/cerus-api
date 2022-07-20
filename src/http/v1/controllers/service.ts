import { EntityManager } from '@mikro-orm/mariadb'
import { startOfDay } from 'date-fns'
import { NextFunction, Request, Response } from 'express'
import fetch from 'node-fetch'
import User from '../../../database/entities/user'
import { DI } from '../../../di'
import config from '../../../config'
import { BaseMessage } from '@cerusbots/common/dist/http/message'

export default function genController() {
  return {
    prometheus: (req: Request, res: Response, next: NextFunction) => {
      try {
        fetch(
          `http://${
            config.prometheus.host
          }:9090/api/v1/${req.originalUrl.replace(req.baseUrl, '')}`,
          {
            method: req.method,
            body: req.body,
            headers: req.headers as Record<string, string>,
          }
        )
          .then(async (resp) => {
            const buff = await resp.buffer()
            for (const key of resp.headers.keys()) {
              if (key === 'connection') continue

              res.setHeader(key, resp.headers.get(key) as string)
            }

            res.status(resp.status).send(buff.toString('ascii'))
            next()
          })
          .catch((e) => next(e))
      } catch (e) {
        next(e)
      }
    },
    stats: (req: Request, res: Response, next: NextFunction) => {
      try {
        const run = async () => {
          const em = DI.db.em.fork() as EntityManager

          const botCount = 0 // TODO

          const userCount = (
            await em.findAndCount(User, {
              deletedAt: null,
            })
          )[1]

          const botsToday = await DI.prometheus.rangeQuery(
            'cerus_api_bots_created{}',
            startOfDay(new Date()),
            new Date(),
            60
          )
          const usersToday = await DI.prometheus.rangeQuery(
            'cerus_api_users_join{}',
            startOfDay(new Date()),
            new Date(),
            60
          )

          res.json(
            new BaseMessage(
              {
                creates: {
                  total: {
                    bots: botCount,
                    users: userCount,
                  },
                  today: {
                    bots: botsToday.result.length,
                    users: usersToday.result.length,
                  },
                },
              },
              'service:stats'
            )
          )
          next()
        }

        run().catch((e) => next(e))
      } catch (e) {
        next(e)
      }
    },
  }
}
