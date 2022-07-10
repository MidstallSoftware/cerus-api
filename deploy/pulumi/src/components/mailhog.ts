import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from '../config'

export const release = (
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new k8s.helm.v3.Release(
    'cerus-mailhog',
    {
      name: 'cerus-mailhog',
      chart: 'mailhog',
      namespace: config.namespace,
      repositoryOpts: {
        repo: 'https://codecentric.github.io/helm-charts',
      },
      values: {
        service: {
          port: {
            http: 8025,
            smtp: 1025,
          },
        },
      },
    },
    { provider, dependsOn }
  )

export default function mailhog(
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) {
  return [release(config, provider, dependsOn)]
}
