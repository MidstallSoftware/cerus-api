import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const dataSources = (config: Configuration, provider?: k8s.Provider) =>
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
    { provider }
  )

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-grafana',
    {
      chart: 'grafana',
      namespace: config.namespace,
      fetchOpts: {
        repo: 'https://charts.bitnami.com/bitnami',
      },
      values: {
        global: {
          storageClass: config.grafana.storage.class,
        },
        service: {
          type: 'LoadBalancer',
        },
        persistence: {
          size: config.grafana.storage.size,
        },
        datasources: {
          secretName: 'cerus-grafana-datasources',
        },
      },
    },
    { provider }
  )
