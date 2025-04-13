import {belongsTo, Entity, model, property} from '@loopback/repository';
import {CategoryItem} from './category-item.model';
import {Merchant} from './merchant.model';
import {Order} from './order.model';

export const ORDER_ITEM_TABLE_NAME = 'order_item';

@model({
  name: ORDER_ITEM_TABLE_NAME
})
export class OrderItem extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = ORDER_ITEM_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    ORDER_ID: 'orderId',
    CATEGORY_ITEM_ID: 'categoryItemId',
    MERCHANT_ID: 'merchantId',
    NAME: 'name',
    DESCRIPTION: 'description',
    PRICE: 'price',
    QUANTITY: 'quantity',
    NOTES: 'notes',
    CREATED_AT: 'createdAt'
  };

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

  @belongsTo(() => Order)
  orderId: number;

  @belongsTo(() => CategoryItem)
  categoryItemId?: number;

  @belongsTo(() => Merchant)
  merchantId: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      type: 'string',
      maxLength: 100,
    },
  })
  name: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
    },
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      type: 'number',
      format: 'decimal',
      minimum: 0,
      maximum: 9999.99,
    },
  })
  price: number;

  @property({
    type: 'number',
    required: true,
    default: 1,
    jsonSchema: {
      type: 'number',
      unsigned: true,
      minimum: 1,
    },
  })
  quantity: number;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
    },
  })
  notes?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  constructor(data?: Partial<OrderItem>) {
    super(data);
  }
}

export interface OrderItemRelations {
  order?: Order;
  categoryItem?: CategoryItem;
  merchant?: Merchant;
}

export type OrderItemWithRelations = OrderItem & OrderItemRelations;
