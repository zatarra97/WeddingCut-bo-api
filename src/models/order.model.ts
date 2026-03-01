import {Entity, model, property} from '@loopback/repository';

@model({name: 'orders'})
export class Order extends Entity {
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
    mysql: {dataType: 'VARCHAR', dataLength: 300},
  })
  coupleName: string;

  @property({
    type: 'string',
    required: true,
    mysql: {dataType: 'DATE'},
  })
  weddingDate: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {enum: ['cloud_link', 'upload_request']},
    mysql: {dataType: "ENUM('cloud_link','upload_request')"},
  })
  deliveryMethod: 'cloud_link' | 'upload_request';

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 1000},
  })
  materialLink?: string;

  @property({
    type: 'number',
    required: true,
    mysql: {dataType: 'DECIMAL', dataPrecision: 6, dataScale: 2},
  })
  materialSizeGb: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {enum: ['1-4', '5-6', '7+']},
    mysql: {dataType: "ENUM('1-4','5-6','7+')"},
  })
  cameraCount: '1-4' | '5-6' | '7+';

  @property({
    type: 'string',
    mysql: {dataType: 'TEXT'},
  })
  generalNotes?: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 1000},
  })
  referenceVideo?: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 20},
  })
  exportFps?: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 20},
  })
  exportBitrate?: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 20},
  })
  exportAspect?: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 20},
  })
  exportResolution?: string;

  @property({
    type: 'any',
    required: true,
    mysql: {dataType: 'JSON'},
  })
  selectedServices: any;

  @property({
    type: 'number',
    mysql: {dataType: 'DECIMAL', dataPrecision: 10, dataScale: 2},
  })
  servicesTotal?: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
    mysql: {dataType: 'DECIMAL', dataPrecision: 10, dataScale: 2},
  })
  cameraSurcharge: number;

  @property({
    type: 'number',
    mysql: {dataType: 'DECIMAL', dataPrecision: 10, dataScale: 2},
  })
  totalPrice?: number;

  @property({
    type: 'string',
    required: true,
    default: 'pending',
    jsonSchema: {enum: ['pending', 'in_progress', 'completed', 'cancelled']},
    mysql: {dataType: "ENUM('pending','in_progress','completed','cancelled')"},
  })
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @property({
    type: 'string',
    mysql: {dataType: 'TEXT'},
  })
  adminNotes?: string;

  @property({
    type: 'string',
    mysql: {dataType: 'VARCHAR', dataLength: 1000},
  })
  deliveryLink?: string;

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

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {}

export type OrderWithRelations = Order & OrderRelations;
