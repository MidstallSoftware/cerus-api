import Redis from 'ioredis'
import config from '../config'

export async function initCache() {
  const client = new Redis(config.cache)
  await client.connect()
  return client
}
