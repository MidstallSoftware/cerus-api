import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from '../config'

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-prometheus',
    {
      chart: 'kube-prometheus',
      namespace: config.namespace,
      fetchOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      values: {
        coreDns: {
          enabled: false,
        },
        kubeProxy: {
          enabled: true,
        },
      },
    },
    { provider }
  )
