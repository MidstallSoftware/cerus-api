import { Router } from 'express'
import { requireAuthHandler } from '../../middleware/auth'
import genController from '../controllers/service'

export default function genServiceRoute() {
  const router = Router()
  const controller = genController()

  router.use('/prometheus', requireAuthHandler, controller.prometheus)
  router.get('/stats', controller.stats)
  return router
}
