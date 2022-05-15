import { Migration } from '@mikro-orm/migrations'

export class Migration20220515164214 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `user` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `discord_id` varchar(255) not null, `customer_id` varchar(255) not null, `is_banned` tinyint(1) not null default false, `type` varchar(255) not null default 'default') default character set utf8mb4 engine = InnoDB;"
    )
    this.addSql(
      'alter table `user` add unique `user_customer_id_unique`(`customer_id`);'
    )

    this.addSql(
      'create table `user_setting` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `key` varchar(255) not null, `value` json null, `user_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `user_setting` add index `user_setting_user_id_index`(`user_id`);'
    )

    this.addSql(
      "create table `bot` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `token` varchar(255) not null, `is_premium` json not null default false, `is_public` json not null default false, `running` json not null default false, `intents` text not null default 'GUILD_MESSAGES,GUILDS', `team_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;"
    )
    this.addSql('alter table `bot` add unique `bot_team_id_unique`(`team_id`);')

    this.addSql(
      'create table `bot_client_hook` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `type` json not null, `bot_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_client_hook` add index `bot_client_hook_bot_id_index`(`bot_id`);'
    )

    this.addSql(
      'create table `bot_command` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `name` varchar(255) not null, `description` varchar(255) not null, `options` json null, `is_premium` tinyint(1) not null default false, `bot_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_command` add index `bot_command_bot_id_index`(`bot_id`);'
    )

    this.addSql(
      'create table `bot_message` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `regex` varchar(255) not null, `bot_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_message` add index `bot_message_bot_id_index`(`bot_id`);'
    )

    this.addSql(
      'create table `bot_report` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `viewed` tinyint(1) not null default false, `handled` tinyint(1) not null default false, `reporter_id` int unsigned not null, `details` varchar(255) not null, `infringing_bot_id` int unsigned null, `infringing_user_id` int unsigned null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_report` add unique `bot_report_reporter_id_unique`(`reporter_id`);'
    )
    this.addSql(
      'alter table `bot_report` add unique `bot_report_infringing_bot_id_unique`(`infringing_bot_id`);'
    )
    this.addSql(
      'alter table `bot_report` add unique `bot_report_infringing_user_id_unique`(`infringing_user_id`);'
    )

    this.addSql(
      'create table `bot_webhook` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `secret` varchar(255) not null, `bot_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_webhook` add index `bot_webhook_bot_id_index`(`bot_id`);'
    )

    this.addSql(
      "create table `bot_code` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `command_id` int unsigned null, `client_hook_id` int unsigned null, `message_id` int unsigned null, `webhook_id` int unsigned null, `value` varchar(255) not null, `lang` enum('ts', 'js') not null) default character set utf8mb4 engine = InnoDB;"
    )
    this.addSql(
      'alter table `bot_code` add index `bot_code_command_id_index`(`command_id`);'
    )
    this.addSql(
      'alter table `bot_code` add index `bot_code_client_hook_id_index`(`client_hook_id`);'
    )
    this.addSql(
      'alter table `bot_code` add index `bot_code_message_id_index`(`message_id`);'
    )
    this.addSql(
      'alter table `bot_code` add index `bot_code_webhook_id_index`(`webhook_id`);'
    )

    this.addSql(
      'create table `bot_client_hook_codes` (`bot_client_hook_id` int unsigned not null, `bot_code_id` int unsigned not null, primary key (`bot_client_hook_id`, `bot_code_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_client_hook_codes` add index `bot_client_hook_codes_bot_client_hook_id_index`(`bot_client_hook_id`);'
    )
    this.addSql(
      'alter table `bot_client_hook_codes` add index `bot_client_hook_codes_bot_code_id_index`(`bot_code_id`);'
    )

    this.addSql(
      'create table `bot_command_codes` (`bot_command_id` int unsigned not null, `bot_code_id` int unsigned not null, primary key (`bot_command_id`, `bot_code_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_command_codes` add index `bot_command_codes_bot_command_id_index`(`bot_command_id`);'
    )
    this.addSql(
      'alter table `bot_command_codes` add index `bot_command_codes_bot_code_id_index`(`bot_code_id`);'
    )

    this.addSql(
      'create table `bot_message_codes` (`bot_message_id` int unsigned not null, `bot_code_id` int unsigned not null, primary key (`bot_message_id`, `bot_code_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_message_codes` add index `bot_message_codes_bot_message_id_index`(`bot_message_id`);'
    )
    this.addSql(
      'alter table `bot_message_codes` add index `bot_message_codes_bot_code_id_index`(`bot_code_id`);'
    )

    this.addSql(
      'create table `bot_webhook_codes` (`bot_webhook_id` int unsigned not null, `bot_code_id` int unsigned not null, primary key (`bot_webhook_id`, `bot_code_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `bot_webhook_codes` add index `bot_webhook_codes_bot_webhook_id_index`(`bot_webhook_id`);'
    )
    this.addSql(
      'alter table `bot_webhook_codes` add index `bot_webhook_codes_bot_code_id_index`(`bot_code_id`);'
    )

    this.addSql(
      'create table `team` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `bot_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql('alter table `team` add index `team_bot_id_index`(`bot_id`);')

    this.addSql(
      "create table `team_member` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `team_id` int unsigned not null, `user_id` int unsigned not null, `role` enum('default', 'editor', 'admin') not null) default character set utf8mb4 engine = InnoDB;"
    )
    this.addSql(
      'alter table `team_member` add index `team_member_team_id_index`(`team_id`);'
    )
    this.addSql(
      'alter table `team_member` add index `team_member_user_id_index`(`user_id`);'
    )

    this.addSql(
      'create table `user_teams` (`user_id` int unsigned not null, `team_id` int unsigned not null, primary key (`user_id`, `team_id`)) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `user_teams` add index `user_teams_user_id_index`(`user_id`);'
    )
    this.addSql(
      'alter table `user_teams` add index `user_teams_team_id_index`(`team_id`);'
    )

    this.addSql(
      'create table `access_token` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `token` varchar(255) not null, `user_id` int unsigned not null) default character set utf8mb4 engine = InnoDB;'
    )
    this.addSql(
      'alter table `access_token` add unique `access_token_token_unique`(`token`);'
    )
    this.addSql(
      'alter table `access_token` add index `access_token_user_id_index`(`user_id`);'
    )

    this.addSql(
      'alter table `user_setting` add constraint `user_setting_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `bot` add constraint `bot_team_id_foreign` foreign key (`team_id`) references `team` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `bot_client_hook` add constraint `bot_client_hook_bot_id_foreign` foreign key (`bot_id`) references `bot` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `bot_command` add constraint `bot_command_bot_id_foreign` foreign key (`bot_id`) references `bot` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `bot_message` add constraint `bot_message_bot_id_foreign` foreign key (`bot_id`) references `bot` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `bot_report` add constraint `bot_report_reporter_id_foreign` foreign key (`reporter_id`) references `user` (`id`) on update cascade;'
    )
    this.addSql(
      'alter table `bot_report` add constraint `bot_report_infringing_bot_id_foreign` foreign key (`infringing_bot_id`) references `bot` (`id`) on update cascade on delete set null;'
    )
    this.addSql(
      'alter table `bot_report` add constraint `bot_report_infringing_user_id_foreign` foreign key (`infringing_user_id`) references `user` (`id`) on update cascade on delete set null;'
    )

    this.addSql(
      'alter table `bot_webhook` add constraint `bot_webhook_bot_id_foreign` foreign key (`bot_id`) references `bot` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `bot_code` add constraint `bot_code_command_id_foreign` foreign key (`command_id`) references `bot_command` (`id`) on update cascade on delete set null;'
    )
    this.addSql(
      'alter table `bot_code` add constraint `bot_code_client_hook_id_foreign` foreign key (`client_hook_id`) references `bot_client_hook` (`id`) on update cascade on delete set null;'
    )
    this.addSql(
      'alter table `bot_code` add constraint `bot_code_message_id_foreign` foreign key (`message_id`) references `bot_message` (`id`) on update cascade on delete set null;'
    )
    this.addSql(
      'alter table `bot_code` add constraint `bot_code_webhook_id_foreign` foreign key (`webhook_id`) references `bot_webhook` (`id`) on update cascade on delete set null;'
    )

    this.addSql(
      'alter table `bot_client_hook_codes` add constraint `bot_client_hook_codes_bot_client_hook_id_foreign` foreign key (`bot_client_hook_id`) references `bot_client_hook` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `bot_client_hook_codes` add constraint `bot_client_hook_codes_bot_code_id_foreign` foreign key (`bot_code_id`) references `bot_code` (`id`) on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table `bot_command_codes` add constraint `bot_command_codes_bot_command_id_foreign` foreign key (`bot_command_id`) references `bot_command` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `bot_command_codes` add constraint `bot_command_codes_bot_code_id_foreign` foreign key (`bot_code_id`) references `bot_code` (`id`) on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table `bot_message_codes` add constraint `bot_message_codes_bot_message_id_foreign` foreign key (`bot_message_id`) references `bot_message` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `bot_message_codes` add constraint `bot_message_codes_bot_code_id_foreign` foreign key (`bot_code_id`) references `bot_code` (`id`) on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table `bot_webhook_codes` add constraint `bot_webhook_codes_bot_webhook_id_foreign` foreign key (`bot_webhook_id`) references `bot_webhook` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `bot_webhook_codes` add constraint `bot_webhook_codes_bot_code_id_foreign` foreign key (`bot_code_id`) references `bot_code` (`id`) on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table `team` add constraint `team_bot_id_foreign` foreign key (`bot_id`) references `bot` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `team_member` add constraint `team_member_team_id_foreign` foreign key (`team_id`) references `team` (`id`) on update cascade;'
    )
    this.addSql(
      'alter table `team_member` add constraint `team_member_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;'
    )

    this.addSql(
      'alter table `user_teams` add constraint `user_teams_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade on delete cascade;'
    )
    this.addSql(
      'alter table `user_teams` add constraint `user_teams_team_id_foreign` foreign key (`team_id`) references `team` (`id`) on update cascade on delete cascade;'
    )

    this.addSql(
      'alter table `access_token` add constraint `access_token_user_id_foreign` foreign key (`user_id`) references `user` (`id`) on update cascade;'
    )
  }
}
