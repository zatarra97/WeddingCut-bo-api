import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {Order} from '../models';
import {OrderRepository} from '../repositories';
import {requireAdmin} from '../utils/authorization';

@authenticate('cognito')
export class AdminOrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
  ) {}

  @get('/admin/orders')
  @response(200, {
    description: 'Lista di tutti gli ordini',
    content: {
      'application/json': {
        schema: {type: 'array', items: getModelSchemaRef(Order)},
      },
    },
  })
  async findAll(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.query.string('status') status?: string,
    @param.query.string('userEmail') userEmail?: string,
    @param.query.number('limit') limit?: number,
    @param.query.number('skip') skip?: number,
  ): Promise<Order[]> {
    requireAdmin(currentUser);
    const where: any = {};
    if (status) where.status = status;
    if (userEmail) where.userEmail = {like: `%${userEmail}%`};
    return this.orderRepository.find({
      where,
      limit,
      skip,
      order: ['createdAt DESC'],
    });
  }

  @get('/admin/orders/{publicId}')
  @response(200, {
    description: 'Dettaglio ordine',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async findOne(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
  ): Promise<Order> {
    requireAdmin(currentUser);
    const [order] = await this.orderRepository.find({
      where: {publicId},
      limit: 1,
    });
    if (!order) throw new HttpErrors.NotFound('Ordine non trovato.');
    return order;
  }

  @patch('/admin/orders/{publicId}')
  @response(204, {description: 'Order PATCH success'})
  async updateOne(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    orderPatch: Partial<Order>,
  ): Promise<void> {
    requireAdmin(currentUser);
    const [order] = await this.orderRepository.find({
      where: {publicId},
      limit: 1,
    });
    if (!order) throw new HttpErrors.NotFound('Ordine non trovato.');
    await this.orderRepository.updateById(order.id!, orderPatch);
  }

  @del('/admin/orders/{publicId}')
  @response(204, {description: 'Order DELETE success'})
  async deleteOne(
    @inject(SecurityBindings.USER) currentUser: UserProfile,
    @param.path.string('publicId') publicId: string,
  ): Promise<void> {
    requireAdmin(currentUser);
    const [order] = await this.orderRepository.find({
      where: {publicId},
      limit: 1,
    });
    if (!order) throw new HttpErrors.NotFound('Ordine non trovato.');
    await this.orderRepository.deleteById(order.id!);
  }
}
