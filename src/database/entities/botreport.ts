import { Entity, Property, OneToOne } from '@mikro-orm/core'
import BaseEntity from '../base'
import Bot from './bot'
import User from './user'

@Entity()
export default class BotReport extends BaseEntity {
  @Property({ default: false })
  viewed!: boolean

  @Property({ default: false })
  handled!: boolean

  @OneToOne(() => User)
  reporter!: User

  @Property()
  details!: string

  @OneToOne({ entity: () => Bot, nullable: true })
  infringingBot!: Bot

  @OneToOne({ entity: () => User, nullable: true })
  infringingUser!: User
}
