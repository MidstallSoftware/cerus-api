import * as k8s from '@pulumi/kubernetes'
import { Configuration } from '../config'

export const deployment = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.apps.v1.Deployment(
    'cerus-mailhog',
    {
      metadata: {
        labels: {
          app: 'cerus-mailhog',
        },
        name: 'cerus-mailhog',
        namespace: config.namespace,
      },
      spec: {
        selector: {
          matchLabels: {
            app: 'cerus-mailhog',
          },
        },
        template: {
          metadata: {
            labels: {
              app: 'cerus-mailhog',
            },
          },
          spec: {
            containers: [
              {
                name: 'mailhog',
                image: 'mailhog/mailhog',
                imagePullPolicy: 'Always',
                ports: [
                  {
                    name: 'http',
                    containerPort: 8025,
                  },
                  { name: 'smtp', containerPort: 1025 },
                ],
              },
            ],
          },
        },
      },
    },
    { provider }
  )

export const service = (config: Configuration, provider?: k8s.Provider) =>
  new k8s.core.v1.Service(
    'cerus-mailhog',
    {
      metadata: {
        labels: {
          app: 'cerus-mailhog',
        },
        name: 'cerus-mailhog',
        namespace: config.namespace,
      },
      spec: {
        clusterIP: 'None',
        ports: [
          { port: 8025, name: 'http' },
          { port: 1025, name: 'smtp' },
        ],
        selector: {
          app: 'cerus-mailhog',
        },
      },
    },
    { provider }
  )
