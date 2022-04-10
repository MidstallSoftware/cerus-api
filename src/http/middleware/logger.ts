import { Request, Response, NextFunction } from 'express'
import winston from '../../providers/winston'

export default function (req: Request, res: Response, next: NextFunction) {
  winston.debug(
    `Receiving request on ${req.protocol}://${req.hostname}${req.originalUrl} (${req.method}) from ${res.socket?.remoteAddress}`
  )
  next()
}
