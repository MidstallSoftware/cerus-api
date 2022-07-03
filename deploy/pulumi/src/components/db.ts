import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-api-db',
    {
      chart: 'mariadb',
      namespace: config.namespace,
      fetchOpts: {
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
    { provider }
  )
