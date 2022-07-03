import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import User from './user'

@Entity()
export default class UserAlert extends BaseEntity {
  @Property({ nullable: true, default: false })
  isRead?: boolean

  @ManyToOne(() => User, { nullable: false })
  user!: User

  @Property({ nullable: false })
  message!: string

  @Property({ nullable: true })
  resourceID?: string

  constructor(user: User, message: string, resourceID?: string) {
    super()
    this.user = user
    this.message = message
    this.resourceID = resourceID
  }
}
