import { Counter } from 'prom-client'

export const botsCreatedCounter = new Counter({
  name: 'cerus_api_bots_created',
  help: 'The number of bots created',
  labelNames: ['id'],
})
