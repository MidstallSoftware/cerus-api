import { EntityManager } from '@mikro-orm/mariadb'
import { APIUser } from 'discord-api-types/v9'
import fetch from 'node-fetch'
import User from '../database/entities/user'
import { DI } from '../di'

export async function checkUser(token: string): Promise<User> {
  const resp = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: token,
    },
  })

  const self = (await resp.json()) as APIUser

  const em = DI.db.em.fork() as EntityManager
  const repo = em.getRepository(User)

  const user = await repo.findOne({
    discordId: self.id,
  })

  if (user === null) {
    const customers = await DI.stripe.customers.list({
      email: self.email as string,
    })

    const customer = customers.data[0]
      ? customers.data[0]
      : await DI.stripe.customers.create({
          email: self.email as string,
          name: `${self.username}#${self.discriminator}`,
          metadata: {
            discordId: self.id,
          },
        })

    return repo.create(new User(self, customer))
  }
  return user
}
