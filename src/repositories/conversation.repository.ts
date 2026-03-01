import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Conversation, ConversationRelations} from '../models';

export class ConversationRepository extends DefaultCrudRepository<
  Conversation,
  typeof Conversation.prototype.id,
  ConversationRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Conversation, dataSource);
  }
}
