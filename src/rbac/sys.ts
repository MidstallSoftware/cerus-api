import { AccessControl } from 'accesscontrol'

const ac = new AccessControl()

ac.grant('default').readOwn('user').updateOwn('user')

ac.grant('admin').extend('default')

export default ac
