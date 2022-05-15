import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import User from './user'

export enum UserSettingKey {
  ADMIN_EMAIL_REPORT = 'admin:emai.report',
  ADMIN_EMAIL_SUMMARY = 'admin.email.summary',
}

export const UserSettingAdminKeys = [
  UserSettingKey.ADMIN_EMAIL_REPORT,
  UserSettingKey.ADMIN_EMAIL_SUMMARY,
]

@Entity()
export default class UserSetting extends BaseEntity {
  @Property()
  @Enum(() => UserSettingKey)
  key!: UserSettingKey

  @Property({ type: 'json', nullable: true })
  value?: string | number | boolean

  @ManyToOne(() => User, { nullable: false })
  user!: User

  @Property({ persist: false })
  canSet(): boolean {
    if (UserSettingAdminKeys.includes(this.key)) {
      return this.user.type === 'admin'
    }
    return true
  }

  constructor(
    user: User,
    key: UserSettingKey,
    value?: string | number | boolean
  ) {
    super()

    this.value = value
    this.key = key
    this.user = user
  }
}
