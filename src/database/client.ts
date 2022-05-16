import { MikroORM } from '@mikro-orm/core'
import winston from '../providers/winston'
import mikroOrmConfig from '../mikro-orm.config'
import { AuditSubscriber } from './subscriber'

export async function initDatabase() {
  winston.debug('Connecting to database')
  const orm = await MikroORM.init({
    ...mikroOrmConfig,
    subscribers: [new AuditSubscriber()],
  })
  winston.info('Connected to database')

  const migrator = orm.getMigrator()
  await migrator.up()
  return orm
}
