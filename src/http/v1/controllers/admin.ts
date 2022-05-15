import { resolve } from 'dns/promises'
import { NextFunction, Request, Response } from 'express'
import Prometheus from 'prom-client'
import config from '../../../config'
import { HttpUnauthorizedError } from '../../exceptions'

export default function genController(): Record<
  string,
  (req: Request, res: Response, next: NextFunction) => void
> {
  return {
    metrics: (req, res, next) => {
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
