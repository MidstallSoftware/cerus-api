import type AccessToken from './database/entities/accesstoken'
import type User from './database/entities/user'
import type { Permission } from 'accesscontrol'

declare module 'express-serve-static-core' {
  export interface Request {
    auth?: {
      accessToken?: AccessToken
      user?: User
      perm?: Permission
    }
  }
}
