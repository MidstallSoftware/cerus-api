import { utcToZonedTime } from 'date-fns-tz'
import config from './config'

export function nowUTC(): Date {
  return utcToZonedTime(new Date(), 'Etc/UTC')
}

export function nowLocal(): Date {
  return utcToZonedTime(nowUTC(), config.timezone)
}
