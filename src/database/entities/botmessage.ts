import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import Bot from './bot'

@Entity()
export default class BotMessage extends BaseEntity {
  @Property()
  regex!: string

  @Property()
  code?: string

  @ManyToOne(() => Bot, { nullable: false })
  bot!: Bot
}
