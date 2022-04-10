import { MikroORM } from '@mikro-orm/core'
import { utcToZonedTime } from 'date-fns-tz'
import { TcpSocketConnectOpts } from 'net'
import { SentMessageInfo as SMTPSentMessageInfo } from 'nodemailer/lib/smtp-transport'
import { Transporter } from 'nodemailer'
import { RedisClientType } from 'redis'
import waitOn from 'wait-on'
import config from './config'
import { initCache } from './cache/client'
import { initDatabase } from './database/client'
import { initMail } from './mail/client'

export const DI = {} as {
  db: MikroORM
  cache: RedisClientType
  mail: Transporter<SMTPSentMessageInfo>
  serverStart: Date
}

export async function init() {
  if (config.env !== 'testing') {
    const redisSocket = config.cache.socket as TcpSocketConnectOpts
    await waitOn({
      resources: [
        config.production ? `tcp:${config.db.host}:${config.db.port}` : false,
        `tcp:${config.mail.host}:${config.mail.port}`,
        `tcp:${redisSocket.host}:${redisSocket.port}`,
      ].filter((v) => v !== false) as string[],
    })
  }

  DI.db = await initDatabase()
  DI.cache = await initCache()
  DI.mail = await initMail()
  DI.serverStart = utcToZonedTime(new Date().toUTCString(), config.timezone)
}
