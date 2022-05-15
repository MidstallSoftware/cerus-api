import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core'
import { APIUser as DiscordUser } from 'discord-api-types/v9'
import Stripe from 'stripe'
import { APIUser } from '../../http/types'
import { DI } from '../../di'
import BaseEntity from '../base'
import AccessToken from './accesstoken'
import Team from './team'
import UserSetting from './usersetting'

export enum UserType {
  DEFAULT = 'default',
  ADMIN = 'admin',
}

@Entity()
export default class User extends BaseEntity {
  @Property()
  discordId!: string

  @Property({ nullable: true, unique: true })
  customerId?: string

  @Property({ nullable: false, default: false })
  isBanned!: boolean

  @Property({ default: UserType.DEFAULT })
  @Enum(() => UserType)
  type: UserType = UserType.DEFAULT

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens = new Collection<AccessToken>(this)

  @OneToMany(() => UserSetting, (userSetting) => userSetting.user)
  settings = new Collection<UserSetting>(this)

  @ManyToMany(() => Team)
  teams = new Collection<Team>(this)

  @Property({ persist: false })
  get bots() {
    return this.teams.getItems().map((v) => v.bot)
  }

  @Property({ persist: false })
  get ownedBots() {
    return this.bots.filter(
      (bot) =>
        bot.team.admins.findIndex((member) => member.user.id === this.id) !== -1
    )
  }

  constructor(
    discord: string | DiscordUser,
    customer?: string | Stripe.Customer
  ) {
    super()

    if (typeof discord === 'string') this.discordId = discord
    else this.discordId = discord.id

    if (typeof customer === 'string') this.customerId = customer
    else if (typeof customer === 'object') this.customerId = customer.id
  }

  @Property({ persist: false })
  getCustomer(): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    if (typeof DI.stripe !== 'object')
      return Promise.reject('Stripe is not enabled')
    if (typeof this.customerId !== 'string')
      return Promise.reject('Customer is not set')

    return DI.stripe.customers.retrieve(this.customerId)
  }

  transform(): APIUser {
    return {
      ...super.transform(),
      banned: this.isBanned,
      type: this.type,
    }
  }
}
