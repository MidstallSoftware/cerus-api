import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core'
import BaseEntity from '../base'
import BotCommand from './botcommand'
import BotInteraction from './botinteraction'
import BotMessage from './botmessage'
import User from './user'

@Entity()
export default class Bot extends BaseEntity {
  @Property({ nullable: false })
  token!: string

  @Property({ default: false })
  isPremium? = false

  @Property({ default: false })
  isPublic? = false

  @Property({ default: false })
  running = false

  @Property({ default: ['GUILD_MESSAGES', 'GUILDS'] })
  intents?: string[] = ['GUILD_MESSAGES', 'GUILDS']

  @ManyToOne(() => User, { nullable: false })
  owner!: User

  @OneToMany(() => BotCommand, (cmd) => cmd.bot)
  commands = new Collection<BotCommand>(this)

  @OneToMany(() => BotMessage, (msg) => msg.bot)
  messages = new Collection<BotMessage>(this)

  @OneToMany(() => BotInteraction, (inter) => inter.bot)
  interactions = new Collection<BotInteraction>(this)
}
