import { EntityManager } from '@mikro-orm/mariadb'
import AccessToken from '../database/entities/accesstoken'
import { DI } from '../di'
import { checkUser } from './user'

export async function checkAccessToken(token: string): Promise<AccessToken> {
  const em = DI.db.em as EntityManager
  const repo = em.getRepository(AccessToken)
  const accessToken = await repo.findOne({
    token,
  })

  if (accessToken === null) {
    return repo.create(
      new AccessToken(token, await checkUser(token))
    )
  }
  return accessToken
}
