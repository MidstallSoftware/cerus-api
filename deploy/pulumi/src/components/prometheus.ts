import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const crd = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.yaml.ConfigGroup('cerus-prometheus-crd', {
    files: [
      'src/manifest/customresourcedefinition-default-alertmanagerconfigs.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-alertmanagers.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-podmonitors.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-probes.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-prometheuses.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-prometheusrules.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-servicemonitors.monitoring.coreos.com.yaml',
      'src/manifest/customresourcedefinition-default-thanosrulers.monitoring.coreos.com.yaml',
    ],
  })

export const chart = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.helm.v3.Chart(
    'cerus-prometheus',
    {
      chart: 'kube-prometheus',
      namespace: config.namespace,
      skipCRDRendering: true,
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
      transformations: [
        (obj, opts) => {
          if (obj.kind === 'CustomResourceDefinition') {
            obj.metadata.annotations = {}
          }
        },
      ],
    },
    { provider }
  )
