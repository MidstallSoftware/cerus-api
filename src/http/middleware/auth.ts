import { expressjwt } from 'express-jwt'
import config from '../../config'

export default expressjwt(config.auth0)
