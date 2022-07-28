import { Router } from 'express'
import auth from '../../middleware/auth'

export default function genUserRoute() {
  const router = Router()

  router.use(auth)
  return router
}
