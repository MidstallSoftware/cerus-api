import {
  ChangeSet,
  ChangeSetType,
  Entity,
  Enum,
  Property,
} from '@mikro-orm/core'
import BaseEntity from '../base'

@Entity()
export default class DatabaseAudit extends BaseEntity {
  @Enum(() => ChangeSetType)
  type!: ChangeSetType

  @Property()
  name!: string

  @Property({ type: 'json', nullable: true })
  value?: object

  constructor(changeSet: ChangeSet<BaseEntity>) {
    super()

    this.type = changeSet.type
    this.name = changeSet.name
    this.value = changeSet.entity.toJSON()
  }
}
