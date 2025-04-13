import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Merchant} from './merchant.model';
import {User} from './user.model';

export const ORDER_TABLE_NAME = 'order';

@model({
  name: ORDER_TABLE_NAME
})
export class Order extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = ORDER_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    USER_ID: 'userId',
    MERCHANT_ID: 'merchantId',
    TOTAL: 'total',
    DELIVERY: 'delivery',
    DELIVERY_COST: 'deliveryCost',
    SCHEDULED_AT: 'scheduledAt',
    STATUS: 'status',
    NOTES: 'notes',
    USER_INFO: 'userInfo',
    SUMMARY: 'summary',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt'
  };

  // Enum per lo stato dell'ordine
  public static readonly STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    READY: 'ready',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
  } as const;

  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      type: 'number',
      unsigned: true,
    }
  })
  id: number;

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Merchant)
  merchantId: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      type: 'number',
      format: 'decimal',
      minimum: 0,
      maximum: 999999.99,
    },
  })
  total: number;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {
      type: 'boolean',
    },
  })
  delivery: boolean;

  @property({
    type: 'number',
    required: true,
    default: 0,
    jsonSchema: {
      type: 'number',
      format: 'decimal',
      minimum: 0,
      maximum: 9999.99,
    },
  })
  deliveryCost: number;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {
      type: 'string',
      format: 'date-time',
    },
  })
  scheduledAt: string;

  @property({
    type: 'string',
    required: true,
    default: 'pending',
    jsonSchema: {
      type: 'string',
      enum: Object.values(Order.STATUS),
    },
  })
  status: typeof Order.STATUS[keyof typeof Order.STATUS];

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
    },
  })
  notes?: string;

  @property({
    type: 'object',
    required: false,
    jsonSchema: {
      type: 'object',
    },
  })
  userInfo: object;

  @property({
    type: 'object',
    required: false,
    jsonSchema: {
      type: 'object',
    },
  })
  summary: object;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  user?: User;
  merchant?: Merchant;
}

export type OrderWithRelations = Order & OrderRelations;
