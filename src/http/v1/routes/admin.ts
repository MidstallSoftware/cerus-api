import { Router } from 'express'
import { validateQuery } from '../../middleware/validate'
import genController from '../controllers/admin'

export default function genAdminRoute() {
  const router = Router()
  const controller = genController()

  router.get('/metrics', controller.metrics)

  router.ws('/events/:resource', controller.events)
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
    controller.audit
  )
  return router
}
