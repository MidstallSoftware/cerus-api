import { BotResource, BotListResource } from '@cerusbots/common/dist/k8s'
import { DI } from '../di'
import config from '../config'

export async function findBots() {
  let bots: BotResource[] = []
  const iterateBots = async (cont?: string) => {
    const body = (
      await DI.k8s.api.customObjects.listNamespacedCustomObject(
        'cerusbots.com',
        'v1alpha1',
        config.namespace,
        'bots',
        undefined,
        undefined,
        cont
      )
    ).body as BotListResource
    const itemsLeft =
      typeof body.metadata === 'object' &&
      typeof body.metadata.remainingItemCount === 'number'
        ? body.metadata.remainingItemCount
        : 0

    bots = bots.concat.call(body.items as BotResource[])
    return itemsLeft > 0 ? body.metadata._continue : undefined
  }

  let cont: string | undefined
  while (typeof (cont = await iterateBots(cont)) === 'string') {}
  return bots
}
