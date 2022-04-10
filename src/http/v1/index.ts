import { Router } from 'express'
import genAdminRoute from './routes/admin'

export default function () {
  const router = Router()

  router.use('/admin', genAdminRoute())
  return router
}
