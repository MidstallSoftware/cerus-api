import { Router } from 'express'
import genAdminRoute from './routes/admin'
import genUserRoute from './routes/user'

export default function () {
  const router = Router()

  router.use('/admin', genAdminRoute())
  router.use('/user', genUserRoute())
  return router
}
