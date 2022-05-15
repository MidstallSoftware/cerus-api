import {
  Logger,
  LoggerNamespace,
  Options,
  ReflectMetadataProvider,
} from '@mikro-orm/core'
import { TSMigrationGenerator } from '@mikro-orm/migrations'
import { RedisCacheAdapter } from 'mikro-orm-cache-adapter-redis'
import { join } from 'path'
import Redis from 'ioredis'
import config from './config'
import winston from './providers/winston'

class MikroORMWinston implements Logger {
  log(ns: LoggerNamespace, msg: string) {
    winston.info(`${ns}: ${msg}`)
  }
  error(ns: LoggerNamespace, msg: string) {
    winston.error(`${ns}: ${msg}`)
  }
  warn(ns: LoggerNamespace, msg: string) {
    winston.warn(`${ns}: ${msg}`)
  }
  logQuery() {
    return void 0
  }
  setDebugMode() {
    return void 0
  }
  isEnabled() {
    return true
  }
}

const mikroOrmConfig: Options = {
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: join(config.buildDir, 'database', 'migrations'),
    pathTs: join(config.sourceDir, 'database', 'migrations'),
    glob: '!(*.d).{js,ts}',
    safe: false,
    transactional: true,
    emit: 'ts',
    generator: TSMigrationGenerator,
  },
  cache: {
    enabled: false,
  },
  metadataProvider: ReflectMetadataProvider,
  entities: [join(config.buildDir, 'database', 'entities')],
  entitiesTs: [join(config.sourceDir, 'database', 'entities')],
  debug: !config.production,
  type: 'mariadb',
  resultCache: {
    adapter: RedisCacheAdapter,
    options: {
      client: new Redis(config.cache),
    },
  },
  baseDir: join(config.buildDir, '..'),
  loggerFactory: () => new MikroORMWinston(),
  ...config.db,
}

export default mikroOrmConfig
