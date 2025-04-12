import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources/mysql.datasource';
import {CategoryItem, CategoryItemRelations} from '../models';

export class CategoryItemRepository extends DefaultCrudRepository<
  CategoryItem,
  typeof CategoryItem.prototype.id,
  CategoryItemRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(CategoryItem, dataSource);
  }
}
