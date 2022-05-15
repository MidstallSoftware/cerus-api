import { Options as DBOptions } from '@mikro-orm/core'
import { Options as SMTPOptions } from 'nodemailer/lib/smtp-transport'
import { join } from 'path'
import { RedisOptions } from 'ioredis'
import { KafkaConfig } from 'kafkajs'

type EnvType = 'production' | 'development' | 'testing' | 'none'

const env = (process.env.NODE_ENV ?? 'development') as EnvType
const production = env === 'production'

interface Config {
  buildDir: string
  sourceDir: string
  dataDir: string
  port: number
  env: EnvType
  production: boolean
  mail: SMTPOptions
  db: DBOptions
  cache: RedisOptions
  kafka: KafkaConfig
  prometheus: {
    host: string
  }
  logLevels: Record<string, string>
  timezone: string
}

const config: Config = {
  buildDir: join(__dirname, '..', 'dist'),
  sourceDir: join(__dirname, '..', 'src'),
  dataDir: join(__dirname, '..', 'data'),
  env,
  production,
  port: parseInt(process.env.PORT || '80'),
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
  prometheus: {
    host: process.env.PROMETHEUS_HOST || 'prometheus',
  },
  logLevels: {
    test: 'error',
    development: 'debug',
    production: 'info',
  },
  timezone: process.env.TZ ?? 'Etc/UTC',
}

export default config
