import { EntityManager } from '@mikro-orm/mariadb'
import { Router } from 'express'
import { expressCacheRoute } from '../cache/http'
import User from '../database/entities/user'
import BaseEntity from '../database/base'
import { DI } from '../di'
import { BaseMessage } from '@cerusbots/common/dist/http/message'
import { APIList, APIObject } from '@cerusbots/common/dist/http/types'

export function createDatabaseRouter<V extends APIObject>(
  obj: typeof BaseEntity,
  name: string
) {
  const router = Router()

  const em = DI.db.em as EntityManager
  const repo = em.getRepository(obj)

  router.get(
    '/list',
    expressCacheRoute(async (req, res) => {
      const offset = parseInt((req.query.offset || '0').toString())
      const pageSize = parseInt((req.query.count || '0').toString())

      const user: User = res.locals.auth.User
      let qb = repo
        .createQueryBuilder()
        .where({
          owner: user,
        })
        .offset(offset)
      if (pageSize > 0) qb = qb.limit(pageSize)

      const query = await qb.getResult()

      return new BaseMessage<APIList<V>>(
        {
          list: query.map((v) => v.transform()) as V[],
          offset,
          size: pageSize,
          total: user.bots.length,
        },
        `${name}:list`
      )
    })
  )
  return router
}
