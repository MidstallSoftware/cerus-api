import { Entity } from '@mikro-orm/core'
import Stripe from 'stripe'
import { APIUser } from '@cerusbots/common/dist/http/types'
import BaseEntity from '../base'

export enum UserType {
  DEFAULT = 'default',
  ADMIN = 'admin',
}

@Entity()
export default class User extends BaseEntity {
  constructor() {
    super()
  }
}
