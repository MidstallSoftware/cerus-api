import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core'
import { APIUser } from 'discord-api-types/v9'
import Stripe from 'stripe'
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

  @Property({ nullable: false, unique: true })
  customerId!: string

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

  get bots() {
    return this.teams.getItems().map((v) => v.bot)
  }

  get ownedBots() {
    return this.bots.filter(
      (bot) =>
        bot.team.admins.findIndex((member) => member.user.id === this.id) !== -1
    )
  }

  constructor(discord: string | APIUser, customer: string | Stripe.Customer) {
    super()

    if (typeof discord === 'string') this.discordId = discord
    else this.discordId = discord.id

    if (typeof customer === 'string') this.customerId = customer
    else this.customerId = customer.id
  }

  getCustomer(): Promise<Stripe.Customer | Stripe.DeletedCustomer> {
    return DI.stripe.customers.retrieve(this.customerId)
  }
}
