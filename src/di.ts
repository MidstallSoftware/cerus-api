import { MikroORM } from '@mikro-orm/core'
import Prometheus from 'prom-client'
import { utcToZonedTime } from 'date-fns-tz'
import { SentMessageInfo as SMTPSentMessageInfo } from 'nodemailer/lib/smtp-transport'
import { Transporter } from 'nodemailer'
import { Redis } from 'ioredis'
import Stripe from 'stripe'
import waitOn from 'wait-on'
import config from './config'
import { initCache } from './cache/client'
import { initDatabase } from './database/client'
import { initMail } from './mail/client'

export const DI = {} as {
  cache: Redis
  db: MikroORM
  mail: Transporter<SMTPSentMessageInfo>
  stripe: Stripe
  serverStart: Date
}

export async function init() {
  if (config.env !== 'testing') {
    await waitOn({
      resources: [
        config.production ? `tcp:${config.db.host}:${config.db.port}` : false,
        `tcp:${config.mail.host}:${config.mail.port}`,
        `tcp:${config.cache.host}:${config.cache.port}`,
      ].filter((v) => v !== false) as string[],
    })
  }

  DI.cache = initCache()
  DI.db = await initDatabase()
  DI.mail = await initMail()
  DI.stripe = new Stripe(process.env.STRIPE_KEY as string, {
    apiVersion: '2020-08-27',
    typescript: true,
  })

  DI.serverStart = utcToZonedTime(new Date().toUTCString(), config.timezone)
  Prometheus.collectDefaultMetrics({ prefix: 'cerus_api_' })
}
