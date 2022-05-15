import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core'
import { closestIndexTo } from 'date-fns'
import { nowUTC } from '../../utils'
import BaseEntity from '../base'
import Bot from './bot'
import BotCode from './botcode'

@Entity()
export default class BotWebhook extends BaseEntity {
  @Property()
  secret!: string

  @ManyToMany(() => BotCode)
  codes = new Collection<BotCode>(this)

  @ManyToOne(() => Bot, { nullable: false })
  bot!: Bot

  get latestCode() {
    const items = this.codes.getItems()
    const dates = items.map((c) => c.createdAt)
    const i = closestIndexTo(nowUTC(), dates)
    return typeof i === 'undefined' ? undefined : items[i]
  }
}
