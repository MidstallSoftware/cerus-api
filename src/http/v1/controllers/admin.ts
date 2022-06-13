import { EntityManager } from '@mikro-orm/mariadb'
import { WebsocketRequestHandler } from 'express-ws'
import { resolve } from 'dns/promises'
import { NextFunction, Request, Response } from 'express'
import Prometheus from 'prom-client'
import config from '../../../config'
import { HttpUnauthorizedError } from '../../exceptions'
import { BaseMessage } from '@cerusbots/common/dist/http/message'
import ac from '../../../rbac/sys'
import DatabaseAudit from '../../../database/entities/databaseaudit'
import { DI } from '../../../di'

export default function genController() {
  return {
    events: ((ws, req, next) => {
      try {
        if (typeof req.auth !== 'object' || typeof req.auth.user !== 'object')
          throw new HttpUnauthorizedError('Authentication is required')

        const perm = ac.can(req.auth.user.type).readAny('system-events')
        if (!perm)
          throw new HttpUnauthorizedError(
            'User does not have permission to stream system events'
          )

        const { resource } = req.params

        const send = (msg: any) =>
          ws.send(JSON.stringify(new BaseMessage(msg, 'admin:event').toJSON()))

        ws.on('close', () => next())
        ws.on('message', () => {
          ws.close()
          next()
        })

        const kafkaResource = (topic: string) => {
          ;(async () => {
            const consumer = DI.kafka.consumer({
              groupId: `admin-event-${req.auth?.user?.id}`,
            })
            await consumer.connect()
            await consumer.subscribe({ topic })
            await consumer.run({
              eachMessage: async ({ message }) => {
                send({
                  timestamp: parseInt(message.timestamp),
                  value: message.value?.toString('utf8'),
                })
              },
            })
          })().catch((e) => {
            ws.send(JSON.stringify(new BaseMessage(null, e)))
            ws.close()
            next()
          })
        }

        switch (resource) {
          case 'database':
            kafkaResource('cerus-database')
            break
          case 'logger':
            kafkaResource('cerus-logger')
            break
          default:
            ws.close()
            next()
            break
        }
      } catch (e) {
        ws.send(
          JSON.stringify(
            new BaseMessage(
              null,
              e instanceof Error ? e : new Error(e as string)
            )
          )
        )
        ws.close()
        next()
      }
    }) as WebsocketRequestHandler,
    audit: (req: Request, res: Response, next: NextFunction) => {
      try {
        if (typeof req.auth !== 'object' || typeof req.auth.user !== 'object')
          throw new HttpUnauthorizedError('Authentication is required')

        const perm = ac.can(req.auth.user.type).readAny('system-audit')

        if (!perm.granted)
          throw new HttpUnauthorizedError(
            'User does not have access to perform an audit'
          )

        const { resource } = req.params
        const offset = parseInt((req.query.offset as string) || '0')
        const limit = parseInt((req.query.limit as string) || '5')
        const order =
          typeof req.query.order === 'string' ? req.query.order : 'asc'

        switch (resource) {
          case 'database':
            ;(async () => {
              const em = DI.db.em.fork() as EntityManager

              const [audits, count] = await em.findAndCount(
                DatabaseAudit,
                {},
                {
                  offset,
                  limit,
                  orderBy: {
                    createdAt: order,
                  },
                }
              )

              res.json(
                new BaseMessage(
                  {
                    query: {
                      kind: resource,
                      offset,
                      limit,
                      order,
                    },
                    count,
                    resources: audits.map((a) => a.toJSON()),
                  },
                  'admin:audit'
                )
              )
            })().catch((e) => next(e))
            break
          default:
            next()
            break
        }
      } catch (e) {
        next(e)
      }
    },
    metrics: (req: Request, res: Response, next: NextFunction) => {
      const remoteAddress = (req.socket.remoteAddress as string)
        .replace('::ffff:', '')
        .split('.')
      const selfAddress = req.ip.replace('::ffff:', '').split('.')

      const send = () => {
        res.set('Content-Type', Prometheus.register.contentType)
        Prometheus.register
          .metrics()
          .then((v) => res.send(v))
          .catch((e) => next(e))
      }

      if (
        remoteAddress[0] === selfAddress[0] &&
        remoteAddress[1] === selfAddress[1] &&
        remoteAddress[2] === selfAddress[2]
      ) {
        send()
        return
      }

      resolve(config.prometheus.host)
        .then((records) => {
          try {
            if (
              !records
                .map((v) => v.replace('::ffff:', ''))
                .includes(remoteAddress.join('.'))
            ) {
              throw new HttpUnauthorizedError(
                'Must be send through the prometheus server'
              )
            }

            send()
          } catch (e) {
            next(e)
          }
        })
        .catch((e) => next(e))
    },
  }
}
