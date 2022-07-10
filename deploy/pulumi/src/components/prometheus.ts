import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from '../config'

export const release = (
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new k8s.helm.v3.Release(
    'cerus-prometheus',
    {
      name: 'cerus-prometheus',
      chart: 'kube-prometheus',
      namespace: config.namespace,
      repositoryOpts: {
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
    { provider, dependsOn }
  )

export default function prometheus(
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) {
  return [release(config, provider, dependsOn)]
}
