import { Histogram } from 'prom-client'

export const auditDatabaseUpdateMetric = new Histogram({
  name: 'audit_database_update',
  help: 'Audit metric for when a database entity is updated',
  labelNames: ['tableName', 'id', 'oldValue', 'newValue', 'editorId'],
})

export const auditDatabaseCreateMetric = new Histogram({
  name: 'audit_database_create',
  help: 'Audit metric for when a database entity is created',
  labelNames: ['tableName', 'id', 'value', 'editorId'],
})

export const auditDatabaseDeleteMetric = new Histogram({
  name: 'audit_database_create',
  help: 'Audit metric for when a database entity is deleted',
  labelNames: ['tableName', 'id', 'editorId'],
})
