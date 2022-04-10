import { Router } from 'express'
import genController from '../controllers/admin'

export default function genAdminRoute() {
  const router = Router()
  const controller = genController()

  router.get('/metrics', controller.metrics)
  return router
}
