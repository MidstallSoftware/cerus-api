import { join } from 'path'
import { MikroORM } from '@mikro-orm/core'
import { TSMigrationGenerator } from '@mikro-orm/migrations'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { RedisCacheAdapter } from 'mikro-orm-cache-adapter-redis'
import config from '../config'
import { DI } from '../di'

export async function initDatabase() {
  return await MikroORM.init({
    migrations: {
      tableName: 'mikro_orm_migrations',
      path: join(config.buildDir, 'database', 'migrations'),
      pathTs: join(config.sourceDir, 'database', 'migrations'),
      glob: '!(*.d).{js,ts}',
      safe: false,
      transactional: true,
      emit: 'ts',
      generator: TSMigrationGenerator,
    },
    metadataProvider: TsMorphMetadataProvider,
    entities: [join(config.sourceDir, 'database', 'entities')],
    entitiesTs: [join(config.buildDir, 'database', 'entities')],
    debug: !config.production,
    type: config.production ? 'mariadb' : 'sqlite',
    resultCache: {
      adapter: RedisCacheAdapter,
      options: {
        client: DI.cache,
      },
    },
    ...config.db,
  })
}
