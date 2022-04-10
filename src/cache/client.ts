import Redis from 'ioredis'
import config from '../config'
import winston from '../providers/winston'

export function initCache() {
  winston.debug('Connecting to Redis')
  const client = new Redis(config.cache)
  winston.info('Connected to Redis')
  return client
}
