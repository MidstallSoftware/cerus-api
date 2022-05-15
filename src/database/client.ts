import { MikroORM } from '@mikro-orm/core'
import winston from '../providers/winston'
import mikroOrmConfig from '../mikro-orm.config'
import { MetricsSubscriber } from './subscriber'

export async function initDatabase() {
  winston.debug('Connecting to database')
  const orm = await MikroORM.init({
    ...mikroOrmConfig,
    subscribers: [new MetricsSubscriber()],
  })
  winston.info('Connected to database')
  return orm
}
