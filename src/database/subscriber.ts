import { EventArgs, EventSubscriber, Subscriber } from '@mikro-orm/core'
import {
  auditDatabaseCreateMetric,
  auditDatabaseDeleteMetric,
  auditDatabaseUpdateMetric,
} from '../metrics/audit'
import BaseEntity from './base'

@Subscriber()
export class MetricsSubscriber implements EventSubscriber {
  async beforeCreate<T extends BaseEntity>(args: EventArgs<T>): Promise<void> {
    if (typeof args.changeSet === 'object') {
      auditDatabaseCreateMetric
        .labels({
          tableName: args.changeSet.name,
          id: args.entity.id,
          value: JSON.stringify(args.entity.toJSON()),
        })
        .inc()
    }
  }
  async beforeUpdate<T extends BaseEntity>(args: EventArgs<T>): Promise<void> {
    if (typeof args.changeSet === 'object') {
      auditDatabaseUpdateMetric
        .labels({
          tableName: args.changeSet.name,
          id: args.entity.id,
          newValue: JSON.stringify(args.entity.toJSON()),
          oldValue: JSON.stringify(args.changeSet.originalEntity),
        })
        .inc()
    }
  }
  async beforeDelete<T extends BaseEntity>(args: EventArgs<T>): Promise<void> {
    if (typeof args.changeSet === 'object') {
      auditDatabaseDeleteMetric
        .labels({
          tableName: args.changeSet.name,
          id: args.entity.id,
        })
        .inc()
    }
  }
}
