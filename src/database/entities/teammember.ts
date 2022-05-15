import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core'
import BaseEntity from '../base'
import Team from './team'
import User from './user'

export enum TeamMemberRole {
  DEFAULT = 'default',
  EDITOR = 'editor',
  ADMIN = 'admin',
}

@Entity()
export default class TeamMember extends BaseEntity {
  @ManyToOne(() => Team, { nullable: false })
  team!: Team

  @ManyToOne(() => User, { nullable: false })
  user!: User

  @Enum(() => TeamMemberRole)
  @Property({ default: TeamMemberRole.DEFAULT })
  role!: TeamMemberRole

  constructor(
    team: Team,
    user: User,
    role: TeamMemberRole = TeamMemberRole.DEFAULT
  ) {
    super()

    this.team = team
    this.user = user
    this.role = role
  }
}
