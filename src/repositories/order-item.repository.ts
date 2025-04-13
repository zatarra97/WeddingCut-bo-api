import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {CategoryItem, Merchant, Order, OrderItem, OrderItemRelations} from '../models';
import {CategoryItemRepository} from './category-item.repository';
import {MerchantRepository} from './merchant.repository';
import {OrderRepository} from './order.repository';

export class OrderItemRepository extends DefaultCrudRepository<
  OrderItem,
  typeof OrderItem.prototype.id,
  OrderItemRelations
> {
  public readonly order: BelongsToAccessor<Order, typeof OrderItem.prototype.id>;
  public readonly categoryItem: BelongsToAccessor<CategoryItem, typeof OrderItem.prototype.id>;
  public readonly merchant: BelongsToAccessor<Merchant, typeof OrderItem.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
    @repository.getter('CategoryItemRepository')
    protected categoryItemRepositoryGetter: Getter<CategoryItemRepository>,
    @repository.getter('MerchantRepository')
    protected merchantRepositoryGetter: Getter<MerchantRepository>,
  ) {
    super(OrderItem, dataSource);

    this.order = this.createBelongsToAccessorFor(
      'order',
      orderRepositoryGetter,
    );
    this.registerInclusionResolver('order', this.order.inclusionResolver);

    this.categoryItem = this.createBelongsToAccessorFor(
      'categoryItem',
      categoryItemRepositoryGetter,
    );
    this.registerInclusionResolver('categoryItem', this.categoryItem.inclusionResolver);

    this.merchant = this.createBelongsToAccessorFor(
      'merchant',
      merchantRepositoryGetter,
    );
    this.registerInclusionResolver('merchant', this.merchant.inclusionResolver);
  }
}
