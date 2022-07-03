import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-kafka',
    {
      chart: 'kafka',
      namespace: config.namespace,
      fetchOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      values: {
        global: {
          storageClass: config.kafka.storage.class,
        },
        persistence: {
          size: config.kafka.storage.size,
        },
        zookeeper: {
          persistence: {
            storageClass: config.zookeeper.storage.class,
            size: config.zookeeper.storage.size,
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
