import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Merchant} from './merchant.model';

export const CATEGORY_TABLE_NAME = 'category';

@model({
  name: CATEGORY_TABLE_NAME
})
export class Category extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = CATEGORY_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    MERCHANT_ID: 'merchantId',
    NAME: 'name',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt'
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
    type: 'date',
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt: string;

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  merchant?: Merchant;
}

export type CategoryWithRelations = Category & CategoryRelations;
