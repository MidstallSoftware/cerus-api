import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core'
import BaseEntity from '../base'
import Bot from './bot'
import TeamMember, { TeamMemberRole } from './teammember'

@Entity()
export default class Team extends BaseEntity {
  @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
  members = new Collection<TeamMember>(this)

  @ManyToOne(() => Bot, { nullable: false })
  bot!: Bot

  @Property({ persist: false })
  get admins() {
    return this.members
      .getItems()
      .filter((member) => member.role === TeamMemberRole.ADMIN)
  }

  constructor(bot: Bot) {
    super()

    this.bot = bot
  }
}
