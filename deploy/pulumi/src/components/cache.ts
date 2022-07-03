import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-api-cache',
    {
      chart: 'redis',
      namespace: config.namespace,
      fetchOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      values: {
        global: {
          storageClass: config.cache.storage.class,
        },
        auth: {
          password: config.cache.password,
        },
        architecture: 'standalone',
        master: {
          persistence: {
            size: config.cache.storage.size,
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
