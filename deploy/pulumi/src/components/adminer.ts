import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-adminer',
    {
      chart: 'adminer',
      namespace: config.namespace,
      fetchOpts: {
        repo: 'https://cetic.github.io/helm-charts',
      },
      values: {
        config: {
          design: 'dracula',
          externalserver: 'mariadb',
        },
      },
    },
    { provider }
  )
