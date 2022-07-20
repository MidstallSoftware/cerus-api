import { Router } from 'express'
import auth from '../../middleware/auth'
import config from '../../../config'

export default function genUserRoute() {
  const router = Router()

  router.use(auth)
  return router
}
