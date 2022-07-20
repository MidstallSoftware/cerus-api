import { Router } from 'express'
import genController from '../controllers/service'

export default function genServiceRoute() {
  const router = Router()
  const controller = genController()

  router.use('/prometheus', controller.prometheus)
  router.get('/stats', controller.stats)
  return router
}
