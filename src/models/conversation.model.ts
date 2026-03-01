import {Entity, model, property} from '@loopback/repository';

@model({name: 'conversations'})
export class Conversation extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 36},
    index: {unique: true},
  })
  publicId: string;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 320},
  })
  userEmail: string;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 500},
  })
  subject: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 36},
  })
  orderId?: string;

  @property({
    type: 'string',
    required: true,
    default: 'open',
    jsonSchema: {enum: ['open', 'closed']},
    mysql: {dataType: "ENUM('open','closed')"},
  })
  status: 'open' | 'closed';

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP'},
  })
  lastMessageAt?: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP'},
  })
  createdAt?: Date;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP'},
  })
  updatedAt?: Date;

  constructor(data?: Partial<Conversation>) {
    super(data);
  }
}

export interface ConversationRelations {}

export type ConversationWithRelations = Conversation & ConversationRelations;
