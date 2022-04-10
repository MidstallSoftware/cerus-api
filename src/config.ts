import { Options as DBOptions } from '@mikro-orm/core'
import { Options as SMTPOptions } from 'nodemailer/lib/smtp-transport'
import { join } from 'path'
import { RedisOptions } from 'ioredis'

type EnvType = 'production' | 'development' | 'testing' | 'none'

const env = (process.env.NODE_ENV ?? 'development') as EnvType
const production = env === 'production'

interface Config {
  buildDir: string
  sourceDir: string
  env: EnvType
  production: boolean
  mail: SMTPOptions
  db: DBOptions
  cache: RedisOptions
  timezone: string
}

const config: Config = {
  buildDir: join(__dirname, '..', 'dist'),
  sourceDir: join(__dirname, '..', 'src'),
  env,
  production,
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
    dbName:
      process.env.DB_NAME ??
      (production ? 'cerus' : join(__dirname, '..', '..', 'database.sqlite')),
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
  },
  cache: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  timezone: process.env.TZ ?? 'Etc/UTC',
}

export default config
