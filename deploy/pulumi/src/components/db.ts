import * as mysql from '@pulumi/mysql'
import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from '../config'

export const user = (
  config: Configuration,
  provider?: mysql.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new mysql.User(
    'user',
    {
      host: '%',
      user: config.db.user.name,
      plaintextPassword: config.db.user.password,
    },
    { provider, dependsOn }
  )

export const database = (
  config: Configuration,
  provider?: mysql.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new mysql.Database(
    'database',
    {
      name: config.db.name,
    },
    { provider, dependsOn }
  )

export const grant = (
  config: Configuration,
  provider?: mysql.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new mysql.Grant(
    'user-grant',
    {
      database: config.db.name,
      host: '%',
      user: config.db.user.name,
      privileges: [
        'ALTER',
        'CREATE',
        'CREATE VIEW',
        'DELETE',
        'DELETE HISTORY',
        'DROP',
        'GRANT OPTION',
        'INDEX',
        'INSERT',
        'SELECT',
        'SHOW VIEW',
        'TRIGGER',
        'UPDATE',
      ],
    },
    { provider, dependsOn }
  )

export default function db(
  config: Configuration,
  kubeProvider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) {
  dependsOn = dependsOn || []
  const provider = new mysql.Provider(
    'mariadb',
    {
      endpoint: config.db.host,
      username: config.db.root.name,
      password: config.db.root.password,
    },
    { provider: kubeProvider, dependsOn }
  )

  const userRes = user(config, provider, [...dependsOn, provider])
  const dbRes = database(config, provider, [...dependsOn, provider])
  const grantRes = grant(config, provider, [...dependsOn, userRes, dbRes])
  return [grantRes, userRes, dbRes]
}
