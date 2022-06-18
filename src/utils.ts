import { formatISO } from 'date-fns'
import { utcToZonedTime, toDate, zonedTimeToUtc } from 'date-fns-tz'
import config from './config'

export function nowUTC(): Date {
  return zonedTimeToUtc(new Date(), 'Etc/UTC')
}

export function nowLocal(): Date {
  return utcToZonedTime(nowUTC(), config.timezone)
}
