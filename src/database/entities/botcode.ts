import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import BotClientHook from './botclienthook'
import BotCommand from './botcommand'
import BotMessage from './botmessage'
import BotWebhook from './botwebhook'

export enum BotCodeLang {
  TS = 'ts',
  JS = 'js',
}

@Entity()
export default class BotCode extends BaseEntity {
  @ManyToOne(() => BotCommand, { nullable: true })
  command?: BotCommand

  @ManyToOne(() => BotClientHook, { nullable: true })
  clientHook?: BotClientHook

  @ManyToOne(() => BotMessage, { nullable: true })
  message?: BotMessage

  @ManyToOne(() => BotWebhook, { nullable: true })
  webhook?: BotWebhook

  @Property()
  value!: string

  @Enum(() => BotCodeLang)
  @Property({ default: BotCodeLang.JS })
  lang!: BotCodeLang

  @Property({ persist: false })
  get bot() {
    if (typeof this.clientHook === 'object') return this.clientHook.bot
    if (typeof this.command === 'object') return this.command.bot
    if (typeof this.message === 'object') return this.message.bot
    if (typeof this.webhook === 'object') return this.webhook.bot

    throw new Error('Code instance is not connected to anything')
  }

  constructor(
    owner: BotCommand | BotClientHook | BotMessage | BotWebhook,
    code: string,
    lang: BotCodeLang = BotCodeLang.JS
  ) {
    super()

    if (owner instanceof BotCommand) this.command = owner
    else if (owner instanceof BotClientHook) this.clientHook = owner
    else if (owner instanceof BotMessage) this.message = owner
    else if (owner instanceof BotWebhook) this.webhook = owner
    else throw new Error('Unsupported instance')

    this.value = code
    this.lang = lang
  }
}
