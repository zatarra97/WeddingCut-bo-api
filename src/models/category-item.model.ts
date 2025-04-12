import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Category} from './category.model';
import {Merchant} from './merchant.model';

export const CATEGORY_ITEM_TABLE_NAME = 'category_item';

@model({
  name: CATEGORY_ITEM_TABLE_NAME
})
export class CategoryItem extends Entity {
  // Costante per il nome della tabella da usare per le query dirette nei controller
  public static readonly TABLE_NAME: string = CATEGORY_ITEM_TABLE_NAME;

  // Definizione centralizzata dei nomi delle colonne
  public static readonly COLUMNS = {
    ID: 'id',
    CATEGORY_ID: 'categoryId',
    MERCHANT_ID: 'merchantId',
    NAME: 'name',
    DESCRIPTION: 'description',
    PRICE: 'price',
    IMG_URL: 'imgUrl',
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

  @belongsTo(() => Category)
  categoryId: number;

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
    type: 'string',
    required: false,
    jsonSchema: {
      type: 'string',
      maxLength: 255,
    },
  })
  imgUrl?: string;

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

  constructor(data?: Partial<CategoryItem>) {
    super(data);
  }
}

export interface CategoryItemRelations {
  category?: Category;
  merchant?: Merchant;
}

export type CategoryItemWithRelations = CategoryItem & CategoryItemRelations;
