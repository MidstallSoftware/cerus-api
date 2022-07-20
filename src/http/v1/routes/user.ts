import { Router } from 'express'
import { auth } from 'express-oauth2-jwt-bearer'
import config from '../../../config'

export default function genUserRoute() {
  const router = Router()
  router.use(auth(config.auth0))
  return router
}
