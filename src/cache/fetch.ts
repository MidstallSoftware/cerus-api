import deepmerge from 'deepmerge'
import fetch, {
  RequestInfo,
  RequestInit,
  Response,
  ResponseInit,
} from 'node-fetch'
import { Cacher, CacherConfig, createCacher } from './base'

interface StoredResponse extends ResponseInit {
  headers: Record<string, string>
}

export function createFetchCache(
  url: RequestInfo,
  init?: RequestInit,
  cfg?: CacherConfig
): Cacher<Response> {
  init = deepmerge<RequestInit>(
    {
      method: 'GET',
      headers: {},
    },
    init || {}
  )
  return createCacher(
    `${url}_${init.method}_${JSON.stringify(init.headers)}`,
    {
      fetch() {
        return fetch(url, init)
      },
      read(data) {
        return new Promise<Response>((resolve, reject) => {
          try {
            const rdata = JSON.parse(data) as {
              body: number[]
              init: StoredResponse
            }

            resolve(new Response(Buffer.from(rdata.body), rdata.init))
          } catch (e) {
            reject(e)
          }
        })
      },
      async write(data) {
        return JSON.stringify({
          body: Buffer.from(await data.arrayBuffer()).toJSON().data,
          init: {
            headers: Object.fromEntries(
              Object.entries(data.headers.raw()).map(([key, value]) => [
                key,
                value.join(','),
              ])
            ),
            status: data.status,
            statusText: data.statusText,
          } as StoredResponse,
        })
      },
    },
    cfg
  )
}
