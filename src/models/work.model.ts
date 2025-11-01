import {Entity, model, property} from '@loopback/repository';

export const WORK_TABLE_NAME = 'works';

@model({
  name: WORK_TABLE_NAME,
  settings: {
    mysql: {
      table: 'works',
    },
  },
})
export class Work extends Entity {
  public static readonly TABLE_NAME: string = WORK_TABLE_NAME;

  public static readonly COLUMNS = {
    ID: 'id',
    SLUG: 'slug',
    VIDEO_URL: 'videoUrl',
    TITOLO: 'titolo',
    TAG: 'tag',
    CAST: 'cast',
    PREVIEW_URL: 'previewUrl',
    GALLERY: 'gallery',
    STATUS: 'status',
    ORDER: 'order',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
  };

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 255,
    },
  })
  slug: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 200,
    },
  })
  videoUrl: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 200,
      nullable: true,
    },
  })
  titolo: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 200,
      nullable: true,
    },
  })
  tag: string;

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      nullable: true,
    },
  })
  cast: object;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      maxLength: 300,
    },
  })
  previewUrl: string;

  @property({
    type: 'object',
    required: true,
    jsonSchema: {
      nullable: true,
    },
  })
  gallery: object;

  @property({
    type: 'string',
    required: false,
    default: 'draft',
    jsonSchema: {
      enum: ['draft', 'published'],
      nullable: true,
    },
  })
  status: 'draft' | 'published';

  @property({
    type: 'number',
    required: false,
    jsonSchema: {
      type: 'integer',
      minimum: 0,
      maximum: 999,
    },
  })
  order?: number;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
  })
  createdAt?: Date;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
  })
  updatedAt?: Date;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Work>) {
    super(data);
  }
}

export interface WorkRelations {
  // Future relations can be added here
}

export type WorkWithRelations = Work & WorkRelations;

