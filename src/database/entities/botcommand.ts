import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core'
import { SlashCommandBuilder } from '@discordjs/builders'
import {
  APIApplicationCommandOption,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9'
import { closestIndexTo } from 'date-fns'
import BaseEntity from '../base'
import { nowUTC } from '../../utils'
import Bot from './bot'
import BotCode from './botcode'

@Entity()
export default class BotCommand extends BaseEntity {
  @Property()
  name!: string

  @ManyToMany(() => BotCode)
  codes = new Collection<BotCode>(this)

  @Property()
  description?: string

  @Property({ type: 'json', nullable: true })
  options?: APIApplicationCommandOption[]

  @Property({ default: false })
  isPremium?: boolean = false

  @ManyToOne(() => Bot, { nullable: false })
  bot!: Bot

  build(): RESTPostAPIApplicationCommandsJSONBody {
    const builder = new SlashCommandBuilder()
    builder.setName(this.name)

    if (this.description) builder.setDescription(this.description)

    const json = builder.toJSON()
    json.options = this.options
    return json
  }

  get latestCode() {
    const items = this.codes.getItems()
    const dates = items.map((c) => c.createdAt)
    const i = closestIndexTo(nowUTC(), dates)
    return typeof i === 'undefined' ? undefined : items[i]
  }
}
