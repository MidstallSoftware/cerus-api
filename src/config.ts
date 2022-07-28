import { Options as DBOptions } from '@mikro-orm/core'
import { expressjwt } from 'express-jwt'
import { Options as SMTPOptions } from 'nodemailer/lib/smtp-transport'
import { join } from 'path'
import { RedisOptions } from 'ioredis'
import { KafkaConfig } from 'kafkajs'
import { hostname } from 'os'

type EnvType = 'production' | 'development' | 'testing' | 'none'

const env = (process.env.NODE_ENV ?? 'development') as EnvType
const production = env === 'production'
const domain = process.env.DOMAIN || hostname()

interface Config {
  buildDir: string
  sourceDir: string
  dataDir: string
  port: number
  env: EnvType
  production: boolean
  debug: boolean
  domain: string
  namespace: string
  mail: SMTPOptions
  db: DBOptions
  cache: RedisOptions
  kafka: KafkaConfig
  auth0: Parameters<typeof expressjwt>[0]
  disabled: {
    stripe: boolean
    sentry: boolean
  }
  logLevels: Record<string, string>
  timezone: string
}

const parseEnvbool = (v: string | undefined, def = false) =>
  typeof v === 'undefined'
    ? def
    : v.toLowerCase() === '1' || v.toLowerCase() === 'true'

const config: Config = {
  buildDir: join(__dirname, '..', 'dist'),
  sourceDir: join(__dirname, '..', 'src'),
  dataDir: join(__dirname, '..', 'data'),
  env,
  production,
  debug: !production,
  domain,
  namespace: process.env.NAMESPACE as string,
  disabled: {
    stripe: parseEnvbool(process.env.DISABLE_STRIPE),
    sentry: parseEnvbool(process.env.DISABLE_SENTRY),
  },
  port: parseInt(process.env.PORT || '80'),
  auth0: {
    audience: `https://${domain}`,
    issuer: process.env.AUTH0_ISSUER as string,
    secret: process.env.AUTH0_SECRET as string,
    algorithms: ['HS256'],
  },
  mail: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: !production,
  },
  db: {
    dbName: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
  cache: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  kafka: {
    brokers: (process.env.KAFKA_BROKERS || '').split(','),
    retry: {
      retries: 30,
    },
  },
  logLevels: {
    test: 'error',
    development: 'debug',
    production: 'info',
  },
  timezone: process.env.TZ ?? 'America/Los_Angeles',
}

export default config
