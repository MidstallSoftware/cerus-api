import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import { Configuration } from '../config'

export const dataSources = (
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new k8s.core.v1.Secret(
    'cerus-grafana-datasources',
    {
      metadata: {
        name: 'cerus-grafana-datasources',
        namespace: config.namespace,
      },
      stringData: {
        'datasources.yml': [
          'apiVersion: 1',
          'datasources:',
          ' - name: Prometheus',
          '   type: prometheus',
          '   orgId: 1',
          `   url: http://cerus-prometheus-kube-prometheus-prometheus.${config.namespace}.svc.cluster.local:9090`,
          '   basicAuth: false',
          '   isDefault: true',
          '   editable: false',
        ].join('\n'),
      },
    },
    { provider, dependsOn }
  )

export const release = (
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) =>
  new k8s.helm.v3.Release(
    'cerus-grafana',
    {
      name: 'cerus-grafana',
      chart: 'grafana',
      namespace: config.namespace,
      repositoryOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      values: {
        global: {
          storageClass: config.grafana.storage.class,
        },
        persistence: {
          size: config.grafana.storage.size,
        },
        datasources: {
          secretName: 'cerus-grafana-datasources',
        },
      },
    },
    { provider, dependsOn }
  )

export default function grafana(
  config: Configuration,
  provider?: k8s.Provider,
  dependsOn?: pulumi.Resource[]
) {
  dependsOn = dependsOn || []
  const dataSourcesRes = dataSources(config, provider, dependsOn)
  const chartRes = release(config, provider, [...dependsOn, dataSourcesRes])
  return [dataSourcesRes, chartRes]
}
