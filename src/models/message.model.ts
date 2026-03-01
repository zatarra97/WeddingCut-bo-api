import {Entity, model, property} from '@loopback/repository';

@model({name: 'messages'})
export class Message extends Entity {
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
    type: 'number',
    required: true,
    mysql: {dataType: 'INT UNSIGNED'},
  })
  conversationId: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {enum: ['user', 'admin']},
    mysql: {dataType: "ENUM('user','admin')"},
  })
  senderRole: 'user' | 'admin';

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'VARCHAR', dataLength: 320},
  })
  senderEmail: string;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'TEXT'},
  })
  content: string;

  @property({
    type: 'date',
    mysql: {dataType: 'TIMESTAMP', nullable: true},
  })
  readAt?: Date | null;

  @property({
    type: 'date',
    defaultFn: 'now',
    mysql: {dataType: 'TIMESTAMP'},
  })
  createdAt?: Date;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {}

export type MessageWithRelations = Message & MessageRelations;
