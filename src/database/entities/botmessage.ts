import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/core'
import { closestIndexTo } from 'date-fns'
import BaseEntity from '../base'
import { nowUTC } from '../../utils'
import Bot from './bot'
import BotCode from './botcode'

@Entity()
export default class BotMessage extends BaseEntity {
  @Property()
  regex!: string

  @ManyToMany(() => BotCode)
  codes = new Collection<BotCode>(this)

  @ManyToOne(() => Bot, { nullable: false })
  bot!: Bot

  @Property({ persist: false })
  get latestCode() {
    const items = this.codes.getItems()
    const dates = items.map((c) => c.createdAt)
    const i = closestIndexTo(nowUTC(), dates)
    return typeof i === 'undefined' ? undefined : items[i]
  }
}
