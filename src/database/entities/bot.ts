import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core'
import BaseEntity from '../base'
import BotCommand from './botcommand'
import BotClientHook from './botclienthook'
import BotMessage from './botmessage'
import Team from './team'

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

  @OneToMany(() => BotCommand, (cmd) => cmd.bot)
  commands = new Collection<BotCommand>(this)

  @OneToMany(() => BotMessage, (msg) => msg.bot)
  messages = new Collection<BotMessage>(this)

  @OneToMany(() => BotClientHook, (inter) => inter.bot)
  clientHooks = new Collection<BotClientHook>(this)

  @OneToOne(() => Team)
  team = new Team(this)

  constructor(token: string, intents?: string[], isPublic?: boolean) {
    super()

    this.token = token

    if (typeof intents === 'object' && Array.isArray(intents))
      this.intents = intents
    if (typeof isPublic === 'boolean') this.isPublic = isPublic
  }
}
