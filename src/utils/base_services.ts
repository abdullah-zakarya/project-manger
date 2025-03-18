import {
  DeepPartial,
  FindOneOptions,
  Repository,
  ObjectLiteral,
} from 'typeorm';
import { HandleErrors } from './error_handler';

export type UpdateDataKeys<T> = keyof T & keyof DeepPartial<T>;
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  statusCode: number;
}

export class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  @HandleErrors()
  async create(entity: DeepPartial<T>): Promise<ApiResponse<T>> {
    const createdEntity = this.repository.create(entity);
    const savedEntity = await this.repository.save(createdEntity);
    return { statusCode: 201, status: 'success', data: savedEntity };
  }

  @HandleErrors()
  async update(
    id: string,
    updateData: DeepPartial<T>,
  ): Promise<ApiResponse<T>> {
    const exist = await this.findOne(id);
    if (!exist || exist.statusCode === 404) return exist;

    const where = this.buildWhere(id);
    const validColumns = this.repository.metadata.columns.map(
      (col) => col.propertyName,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    for (const key of Object.keys(updateData)) {
      if (validColumns.includes(key)) {
        query[key] = updateData[key];
      }
    }
    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set(query)
      .where(where)
      .returning('*')
      .execute();

    if (result.affected && result.affected > 0)
      return { statusCode: 200, status: 'success', data: result.raw[0] };

    return {
      statusCode: 400,
      status: 'error',
      message: 'Invalid data',
    };
  }

  @HandleErrors()
  async findOne(id: string): Promise<ApiResponse<T>> {
    const where = this.buildWhere(id);
    const data = await this.repository.findOne({ where } as FindOneOptions<T>);

    if (data) return { statusCode: 200, status: 'success', data };
    return { statusCode: 404, status: 'error', message: 'Not Found' };
  }

  @HandleErrors()
  async findAll(
    queryParams: Record<string, unknown>,
  ): Promise<ApiResponse<T[]>> {
    let data: T[];

    if (Object.keys(queryParams).length > 0) {
      const query = this.repository.createQueryBuilder();
      for (const field in queryParams) {
        query.andWhere(`${field} = :value`, { value: queryParams[field] });
      }
      data = await query.getMany();
    } else {
      data = await this.repository.find();
    }

    return { statusCode: 200, status: 'success', data };
  }

  @HandleErrors()
  async delete(id: string): Promise<ApiResponse<T>> {
    const exist = await this.findOne(id);
    if (!exist || exist.statusCode === 404) return exist;

    await this.repository.delete(id);
    return { statusCode: 200, status: 'success' };
  }
  @HandleErrors()
  async findByIds(ids: string[]): Promise<ApiResponse<T[]>> {
    const data = await this.repository
      .createQueryBuilder()
      .whereInIds(ids)
      .getMany();
    return { statusCode: 200, status: 'success', data: data };
  }
  async customQuery(query: string): Promise<T[]> {
    try {
      const data = await this.repository
        .createQueryBuilder()
        .where(query)
        .getMany();

      return data;
    } catch (error) {
      console.error(`Error while executing custom query: ${query}`, error);
      return [];
    }
  }

  /**
   * Constructs a where clause object for querying the repository based on the given ID.
   * The ID is mapped to the primary key of the entity.
   *
   * @param {string} id - The ID of the entity to build the where clause for.
   * @returns {Record<string, string>} An object representing the where clause with the primary key as the key and the provided ID as the value.
   */
  private buildWhere(id: string): Record<string, string> {
    const primaryKey = this.repository.metadata.primaryColumns[0].propertyName;
    return { [primaryKey]: id };
  }
}
