import { utcToZonedTime } from 'date-fns-tz'
import config from './config'

export function nowUTC(): Date {
  return new Date(new Date().toUTCString())
}

export function nowLocal(): Date {
  return utcToZonedTime(new Date().toUTCString(), config.timezone)
}
