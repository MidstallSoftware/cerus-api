import { Migration } from '@mikro-orm/migrations'

export class Migration20220515212548 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `database_audit` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `deleted_at` datetime null, `type` enum('create', 'update', 'delete', 'delete_early') not null, `name` varchar(255) not null, `value` json null) default character set utf8mb4 engine = InnoDB;"
    )

    this.addSql('alter table `user` modify `customer_id` varchar(255) null;')

    this.addSql(
      'alter table `bot` modify `is_premium` json not null default false, modify `is_public` json not null default false, modify `running` json not null default false;'
    )
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `database_audit`;')

    this.addSql(
      'alter table `bot` modify `is_premium` json not null default 0, modify `is_public` json not null default 0, modify `running` json not null default 0;'
    )

    this.addSql(
      'alter table `user` modify `customer_id` varchar(255) not null;'
    )
  }
}
