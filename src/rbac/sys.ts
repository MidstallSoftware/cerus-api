import { AccessControl } from 'accesscontrol'

const ac = new AccessControl()

ac.grant('default')
  .readOwn('user')
  .updateOwn('user')
  .createOwn('bot')
  .updateOwn('bot')
  .deleteOwn('bot')

ac.grant('admin')
  .extend('default')
  .readAny('system-audit')
  .readAny('system-events')
  .readAny('prometheus')

export default ac
