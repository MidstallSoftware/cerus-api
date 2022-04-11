import type AccessToken from '../src/database/entities/accesstoken'
import type User from '../src/database/entities/user'

declare module 'express-serve-static-core' {
  export interface Request {
    auth?: {
      accessToken: AccessToken
      user: User
    }
  }
}
