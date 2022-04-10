import deepmerge from 'deepmerge'
import { DI } from '../di'

export interface CacherConfig {
  expires: number
}

export interface BaseCacher<T> {
  fetch(): Promise<T>
  read(data: string): Promise<T>
  write(data: T): Promise<string>
}

export interface Cacher<T> {
  getConfig(): CacherConfig
  setConfig(cfg: Partial<CacherConfig>): Cacher<T>
  write(data: T): Promise<Cacher<T>>
  read(): Promise<T>
  exists(): Promise<boolean>
  invalidate(): Promise<boolean>
}

function makeCacherConfig(cfg?: Partial<CacherConfig>): CacherConfig {
  return deepmerge<CacherConfig>(
    {
      expires: 2 * 60, // 2 minutes
    },
    cfg || {}
  )
}

export async function readCacher<T>(
  key: string,
  base: BaseCacher<T>,
  cfg?: Partial<CacherConfig>
): Promise<T> {
  const exists = (await DI.cache.exists(key)) > 0
  if (exists) {
    const value = (await DI.cache.get(key)) as string
    return base.read(value)
  }

  const fetched = await base.fetch()
  const value = await base.write(fetched)
  const rcfg = makeCacherConfig(cfg)
  DI.cache.set(key, value, 'EX', rcfg.expires)
  return fetched
}

export async function writeCacher<T>(
  key: string,
  base: BaseCacher<T>,
  value: T,
  cfg?: CacherConfig
): Promise<void> {
  const exists = (await DI.cache.exists(key)) > 0
  if (exists) await DI.cache.del(key)

  const rcfg = makeCacherConfig(cfg)
  const rval = await base.write(value)
  DI.cache.set(key, rval, 'EX', rcfg.expires)
}

export function createCacher<T>(
  key: string,
  base: BaseCacher<T>,
  cfg?: CacherConfig
): Cacher<T> {
  let rcfg = makeCacherConfig(cfg)
  const cacher = {} as Cacher<T>

  cacher.getConfig = () => rcfg
  cacher.setConfig = (ncfg) => {
    rcfg = makeCacherConfig(ncfg)
    return cacher
  }

  cacher.exists = async () => (await DI.cache.exists(key)) > 0
  cacher.invalidate = async () => (await DI.cache.del(key)) > 0
  cacher.read = async () => await readCacher(key, base, rcfg)
  cacher.write = async (value) => {
    await writeCacher(key, base, value, rcfg)
    return cacher
  }
  return cacher
}
