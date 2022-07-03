import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-kowl',
    {
      chart: 'kowl',
      namespace: config.namespace,
      fetchOpts: {
        repo: 'https://raw.githubusercontent.com/cloudhut/charts/master/archives',
      },
      values: {
        kowl: {
          config: {
            kafka: {
              brokers: config.kafka.brokers,
            },
          },
        },
      },
    },
    { provider }
  )
