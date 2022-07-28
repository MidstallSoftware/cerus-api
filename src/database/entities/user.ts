import { Entity, Property } from '@mikro-orm/core'
import BaseEntity from '../base'

@Entity()
export default class User extends BaseEntity {
  @Property()
  auth0ID!: string

  constructor(auth0ID: string) {
    super()

    this.auth0ID = auth0ID
  }
}
