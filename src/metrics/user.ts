import { Counter } from 'prom-client'

export const usersJoinCounter = new Counter({
  name: 'cerus_api_users_join',
  help: 'The number of users who join Cerus',
  labelNames: ['discordId'],
})

export const usersAccessCounter = new Counter({
  name: 'cerus_api_users_access',
  help: 'An incremental counter for when a user logs into Cerus',
  labelNames: ['discordId'],
})
