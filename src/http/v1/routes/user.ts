import { Router } from 'express'
import genController from '../controllers/user'
import { requireAuthHandler } from '../../middleware/auth'

export default function genUserRoute() {
  const router = Router()
  const controller = genController()

  router.get('/', requireAuthHandler, controller.get)
  return router
}
