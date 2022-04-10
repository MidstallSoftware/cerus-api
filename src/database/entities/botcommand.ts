import { Entity, ManyToOne, Property } from '@mikro-orm/core'
import { SlashCommandBuilder } from '@discordjs/builders'
import {
  APIApplicationCommandOption,
  RESTPostAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v9'
import BaseEntity from '../base'
import Bot from './bot'

@Entity()
export default class BotCommand extends BaseEntity {
  @Property()
  name!: string

  @Property()
  code?: string

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
}
