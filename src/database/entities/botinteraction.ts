import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { ClientEvents } from 'discord.js'
import BaseEntity from '../base'
import Bot from './bot'

@Entity()
export default class BotInteraction extends BaseEntity {
  @Property()
  type!: keyof ClientEvents

  @Property()
  code?: string

  @ManyToOne(() => Bot, { nullable: false })
  bot!: Bot
}
