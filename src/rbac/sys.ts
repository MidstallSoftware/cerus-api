import { AccessControl } from 'accesscontrol'

const ac = new AccessControl()

ac.grant('default').readOwn('user').updateOwn('user')

ac.grant('admin')
  .extend('default')
  .readAny('system-audit')
  .readAny('system-events')
  .readAny('prometheus')

export default ac
