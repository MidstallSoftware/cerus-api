import { Router } from 'express'
import genAdminRoute from './routes/admin'
import genBotRoute from './routes/bot'
import genServiceRoute from './routes/service'
import genUserRoute from './routes/user'

export default function () {
  const router = Router()

  router.use('/admin', genAdminRoute())
  router.use('/bot', genBotRoute())
  router.use('/service', genServiceRoute())
  router.use('/user', genUserRoute())
  return router
}
