import { createClient } from 'redis'
import config from '../config'

export async function initCache() {
  const client = createClient(config.cache)
  await client.connect()
  return client
}
