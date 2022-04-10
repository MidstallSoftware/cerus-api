import { resolve } from 'dns/promises'
import { NextFunction, Request, Response } from 'express'
import Prometheus from 'prom-client'
import { HttpUnauthorizedError } from '../../exceptions'

export default function genController(): Record<
  string,
  (req: Request, res: Response, next: NextFunction) => void
> {
  return {
    metrics: (req, res, next) => {
      resolve('prometheus')
        .then((records) => {
          try {
            if (
              !records
                .map((v) => v.replace('::ffff:', ''))
                .includes(
                  (req.socket.remoteAddress as string).replace('::ffff:', '')
                )
            ) {
              throw new HttpUnauthorizedError(
                'Must be send through the prometheus server'
              )
            }

            res.set('Content-Type', Prometheus.register.contentType)
            res.send(Prometheus.register.metrics())
          } catch (e) {
            next(e)
          }
        })
        .catch((e) => next(e))
    },
  }
}
