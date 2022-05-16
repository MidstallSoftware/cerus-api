import {
  ChangeSet,
  EventSubscriber,
  FlushEventArgs,
  Subscriber,
} from '@mikro-orm/core'
import { CompressionTypes, Producer } from 'kafkajs'
import { DI } from '../di'
import BaseEntity from './base'
import DatabaseAudit from './entities/databaseaudit'

@Subscriber()
export class AuditSubscriber implements EventSubscriber {
  private producer?: Producer

  async getProducer() {
    if (typeof this.producer === 'undefined') {
      this.producer = DI.kafka.producer({
        allowAutoTopicCreation: true,
      })

      await this.producer.connect()
    }
    return this.producer
  }

  async onFlush(args: FlushEventArgs): Promise<void> {
    await Promise.all(
      args.uow
        .getChangeSets()
        .filter((cs) => !(cs.entity instanceof DatabaseAudit))
        .map(async (cs) => {
          const audit = new DatabaseAudit(cs as ChangeSet<BaseEntity>)

          args.uow.computeChangeSet(audit)
          args.uow.recomputeSingleChangeSet(audit)

          const producer = await this.getProducer()
          await producer.send({
            topic: 'cerus-database',
            messages: [{ value: JSON.stringify(audit.toJSON()) }],
            compression: CompressionTypes.GZIP,
          })
        })
    )
  }
}
