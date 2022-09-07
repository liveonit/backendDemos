import { ApolloError } from 'apollo-server-errors';
import { db, Db } from '@src/db';
import {
  BaseEntity,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  ObjectID,
  ObjectType,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseService<T extends BaseEntity> {
  protected readonly model: ObjectType<T>;
  protected readonly db: Db;
  constructor(model: ObjectType<T>) {
    this.model = model;
    this.db = db;
  }
  protected getEntity = () => this.db.getConnection().getRepository<T>(this.model);

  public readonly get = async (options?: FindOneOptions<T>) => {
    return this.getEntity().findOneOrFail({ ...options });
  };

  public readonly getMany = async (options?: FindManyOptions<T>) => {
    return this.getEntity().find(options);
  };

  public readonly create = async (data: T) => {
    return this.getEntity().create(data).save();
  };

  public readonly insertMany = async (entities: T[]) => {
    return this.db.getConnection().transaction('READ COMMITTED', async (em) => {
      const result = await em.insert<T>(this.model, entities as any[]);
      return em.findBy<T>(this.model, result.identifiers as FindOptionsWhere<T>[]);
    });
  };

  public readonly delete = async <I extends string | number | ObjectID>(id: I) => {
    const result = await this.getEntity().delete(id);
    if (result.affected === 0) throw new ApolloError('Entity not found');
    else return id;
  };

  public readonly update = async (data: Partial<T>) => {
    await this.getEntity().update(
      this.getEntity().getId(data as T),
      data as QueryDeepPartialEntity<T>,
    );
    return this.getEntity().findOneByOrFail(data as FindOptionsWhere<T>);
  };
}
