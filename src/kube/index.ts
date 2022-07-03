import * as k8s from '@kubernetes/client-node'

export interface KubeDI {
  watch: k8s.Watch
  config: k8s.KubeConfig
  api: {
    customObjects: k8s.CustomObjectsApi
    apps: k8s.AppsV1Api
  }
}

export async function initKube(): Promise<KubeDI> {
  const config = new k8s.KubeConfig()
  config.loadFromDefault()

  const watch = new k8s.Watch(config)
  return {
    watch,
    config,
    api: {
      customObjects: config.makeApiClient(k8s.CustomObjectsApi),
      apps: config.makeApiClient(k8s.AppsV1Api),
    },
  }
}
