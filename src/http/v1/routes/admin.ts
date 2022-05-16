import { Router } from 'express'
import { validateQuery } from '../../middleware/validate'
import { authHandler, requireAuthHandler } from '../../middleware/auth'
import genController from '../controllers/admin'

export default function genAdminRoute() {
  const router = Router()
  const controller = genController()

  router.get('/metrics', controller.metrics)

  router.ws(
    '/events/:resource',
    (_ws, req, next) => authHandler({ required: false })(req, null, next),
    controller.events
  )
  router.get(
    '/audit/:resource',
    validateQuery({
      type: 'object',
      properties: {
        offset: { type: 'string', pattern: /[0-9]+/ },
        limit: { type: 'string', pattern: /[0-9]+/ },
        order: { type: 'string', enum: ['asc', 'dec'] },
      },
    }),
    requireAuthHandler,
    controller.audit
  )
  return router
}
