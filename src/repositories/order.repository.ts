import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {Merchant, Order, OrderRelations} from '../models';
import {MerchantRepository} from './merchant.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  public readonly merchant: BelongsToAccessor<Merchant, typeof Order.prototype.id>;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('MerchantRepository')
    protected merchantRepositoryGetter: Getter<MerchantRepository>,
  ) {
    super(Order, dataSource);
    this.merchant = this.createBelongsToAccessorFor(
      'merchant',
      merchantRepositoryGetter,
    );
    this.registerInclusionResolver('merchant', this.merchant.inclusionResolver);
  }
}
