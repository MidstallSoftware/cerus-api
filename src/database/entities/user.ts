import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import AccessToken from './accesstoken'
import Bot from './bot'
import UserSetting from './usersetting'

export enum UserType {
  DEFAULT = 'default',
  ADMIN = 'admin',
}

@Entity()
export default class User extends BaseEntity {
  @Property()
  discordId!: string

  @Property()
  customerId!: string

  @Property({ default: UserType.DEFAULT })
  @Enum(() => UserType)
  type: UserType = UserType.DEFAULT

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens = new Collection<AccessToken>(this)

  @OneToMany(() => UserSetting, (userSetting) => userSetting.user)
  settings = new Collection<UserSetting>(this)

  @OneToMany(() => Bot, (bot) => bot.owner)
  bots = new Collection<Bot>(this)
}
