import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import User from './user'

@Entity()
export default class AccessToken extends BaseEntity {
  @Property({ nullable: false })
  token!: string

  @ManyToOne(() => User, { nullable: false })
  user!: User
}
