import { Gauge } from 'prom-client'

export const auditDatabaseUpdateMetric = new Gauge({
  name: 'cerus_api_audit_database_update',
  help: 'Audit metric for when a database entity is updated',
  labelNames: ['tableName', 'id', 'oldValue', 'newValue'],
})

export const auditDatabaseCreateMetric = new Gauge({
  name: 'cerus_api_audit_database_create',
  help: 'Audit metric for when a database entity is created',
  labelNames: ['tableName', 'id', 'value'],
})

export const auditDatabaseDeleteMetric = new Gauge({
  name: 'cerus_api_audit_database_create',
  help: 'Audit metric for when a database entity is deleted',
  labelNames: ['tableName', 'id'],
})
