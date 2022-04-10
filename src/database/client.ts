import { MikroORM } from '@mikro-orm/core'
import winston from '../providers/winston'
import mikroOrmConfig from '../mikro-orm.config'

export async function initDatabase() {
  winston.debug('Connecting to database')
  const orm = await MikroORM.init(mikroOrmConfig)
  winston.info('Connected to database')
  return orm
}
