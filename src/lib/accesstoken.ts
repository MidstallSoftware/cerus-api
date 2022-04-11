import { EntityManager } from '@mikro-orm/mariadb'
import { auditDatabaseCreateMetric } from '../metrics/audit'
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
    const accessToken = repo.create(
      new AccessToken(token, await checkUser(token))
    )
    auditDatabaseCreateMetric
      .labels({
        tableName: 'accessTokens',
        id: accessToken.id,
        value: JSON.stringify(accessToken.toJSON()),
        editorId: accessToken.user.id,
      })
      .inc()
    return accessToken
  }
  return accessToken
}
