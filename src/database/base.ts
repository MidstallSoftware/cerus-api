import { PrimaryKey, Property } from '@mikro-orm/core'
import { nowUTC } from '../utils'

export default class BaseEntity {
  @PrimaryKey()
  id!: number

  @Property()
  createdAt: Date = nowUTC()

  @Property({ onUpdate: () => nowUTC() })
  updatedAt: Date = nowUTC()

  @Property({ nullable: true })
  deletedAt?: Date
}
