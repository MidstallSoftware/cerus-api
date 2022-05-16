import {
  PrimaryKey,
  Property,
  BaseEntity as MOBaseEntity,
  Entity,
} from '@mikro-orm/core'
import { APIObject } from '../http/types'
import { nowUTC } from '../utils'

@Entity({ abstract: true })
export default class BaseEntity extends MOBaseEntity<BaseEntity, 'id'> {
  @PrimaryKey()
  id!: number

  @Property()
  createdAt: Date = nowUTC()

  @Property({ onUpdate: () => nowUTC() })
  updatedAt: Date = nowUTC()

  @Property({ nullable: true })
  deletedAt?: Date

  transform(): APIObject {
    return {
      id: this.id,
      created: this.createdAt,
    }
  }
}
