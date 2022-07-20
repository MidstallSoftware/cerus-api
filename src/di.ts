import { MikroORM } from '@mikro-orm/core'
import { Kafka } from 'kafkajs'
import Prometheus from 'prom-client'
import { PrometheusDriver } from 'prometheus-query'
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
import { KubeDI, initKube } from './kube'

export const DI = {} as {
  cache: Redis
  db: MikroORM
  kafka: Kafka
  mail: Transporter<SMTPSentMessageInfo>
  prometheus: PrometheusDriver
  stripe?: Stripe
  k8s: KubeDI
  serverStart: Date
}

export async function init() {
  if (config.env !== 'testing') {
    await waitOn({
      resources: [
        `tcp:${config.db.host}:${config.db.port}`,
        `tcp:${config.mail.host}:${config.mail.port}`,
        `tcp:${config.cache.host}:${config.cache.port}`,
        `tcp:${config.prometheus.host}:9090`,
        ...(config.kafka.brokers as string[]).map((str) => `tcp:${str}`),
      ],
      log: config.debug,
    })
  }

  DI.kafka = new Kafka(config.kafka)
  DI.cache = initCache()
  DI.db = await initDatabase()
  DI.mail = await initMail()
  DI.prometheus = new PrometheusDriver({
    endpoint: `http://${config.prometheus.host}:9090`,
    baseURL: '/api/v1',
  })
  DI.stripe = config.disabled.stripe
    ? undefined
    : new Stripe(process.env.STRIPE_KEY as string, {
        apiVersion: '2020-08-27',
        typescript: true,
      })

  DI.k8s = await initKube()

  DI.serverStart = utcToZonedTime(new Date().toUTCString(), config.timezone)
  Prometheus.collectDefaultMetrics({ prefix: 'cerus_api_' })
}
