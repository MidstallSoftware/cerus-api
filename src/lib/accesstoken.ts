import { EntityManager } from '@mikro-orm/mariadb'
import { usersAccessCounter } from '../metrics/user'
import AccessToken from '../database/entities/accesstoken'
import { DI } from '../di'
import { checkUser } from './user'

export async function checkAccessToken(token: string): Promise<AccessToken> {
  const em = DI.db.em.fork() as EntityManager
  const accessToken = await em.findOne(
    AccessToken,
    {
      token,
    },
    { populate: ['user'] }
  )

  if (accessToken === null) {
    const ac = new AccessToken(token, await checkUser(token))
    await em.persistAndFlush(ac)
    usersAccessCounter.inc({ discordId: ac.user.discordId })
    return ac
  }
  return accessToken
}
