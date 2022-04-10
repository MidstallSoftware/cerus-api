export function nowUTC(): Date {
  return new Date(new Date().toUTCString())
}
