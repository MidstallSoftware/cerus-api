import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from '../config'

export const release = (
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new k8s.helm.v3.Release(
    'cerus-api-db',
    {
      name: 'cerus-api-db',
      chart: 'mariadb',
      namespace: config.namespace,
      repositoryOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      values: {
        global: {
          storageClass: config.db.storage.class,
        },
        auth: {
          password: config.db.password,
          username: config.db.username,
          database: config.db.name,
        },
        primary: {
          persistence: {
            size: config.db.storage.size,
          },
        },
        metrics: {
          enabled: true,
          serviceMonitor: {
            enabled: true,
          },
        },
      },
    },
    { provider, dependsOn }
  )

export default function db(
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) {
  return [release(config, provider, dependsOn)]
}
