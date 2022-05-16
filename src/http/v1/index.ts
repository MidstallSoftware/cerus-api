import { Router } from 'express'
import genAdminRoute from './routes/admin'
import genServiceRoute from './routes/service'
import genUserRoute from './routes/user'

export default function () {
  const router = Router()

  router.use('/admin', genAdminRoute())
  router.use('/service', genServiceRoute())
  router.use('/user', genUserRoute())
  return router
}
