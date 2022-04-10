import { Request, Response, NextFunction } from 'express'
import { BaseMessage } from '../http/message'
import { readCacher } from './base'

export function expressCacheRoute(
  route: (
    req: Request,
    res: Response
  ) => Promise<BaseMessage<unknown>> | BaseMessage<unknown>
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req, res, next) => {
    const key = JSON.stringify({
      auth: req.headers.authorization || false,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
      url: req.originalUrl,
    })

    try {
      const value = await readCacher<BaseMessage<unknown>>(key, {
        fetch() {
          try {
            const msg = route(req, res)
            if (msg instanceof BaseMessage) return Promise.resolve(msg)
            return msg
          } catch (e) {
            return Promise.reject(e)
          }
        },
        read(data) {
          return Promise.resolve(JSON.parse(data) as BaseMessage<unknown>)
        },
        write(data) {
          return Promise.resolve(JSON.stringify(data.toJSON()))
        },
      })
      res.json(value)
    } catch (e) {
      next(e)
    }
  }
}
