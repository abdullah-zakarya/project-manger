import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { ApiResponse, UpdateDataKeys } from "./base_services";
import { HandleErrors } from "./error_handler";

export class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}

  @HandleErrors()
  async create(entity: DeepPartial<T>): Promise<ApiResponse<T>> {
    const createdEntity = await this.repository.create(entity);
    const savedEntity = await this.repository.save(createdEntity);
    return { statusCode: 201, status: "success", data: savedEntity };
  }

  @HandleErrors()
  async update(
    id: string,
    updateData: DeepPartial<T>
  ): Promise<ApiResponse<T> | undefined> {
    const exist = await this.findOne(id);
    if (!exist) return exist;

    const where = this.buildWhere(id);
    const validColumns = this.repository.metadata.columns.map(
      (cul) => cul.propertyName
    );

    const query = {};
    const keys = Object.keys(updateData as UpdateDataKeys<T>);
    for (const key of keys)
      if (updateData.hasOwnProperty(key) && validColumns.includes(key))
        query[key] = updateData[key];

    const result = await this.repository
      .createQueryBuilder()
      .update()
      .set(query)
      .where(where)
      .returning("*")
      .execute();

    if (result.affected > 0)
      return { statusCode: 200, status: "success", data: result.raw[0] };

    return {
      statusCode: 400,
      status: "error",
      data: null,
      message: "invalid date",
    };
  }

  @HandleErrors()
  async findOne(id: string): Promise<ApiResponse<T> | undefined> {
    const where = this.buildWhere(id);
    const options: FindOneOptions<T> = { where } as FindOneOptions<T>;
    const data = await this.repository.findOne(options);

    if (data) {
      return { statusCode: 200, status: "success", data: data };
    } else {
      return { statusCode: 404, status: "error", message: "Not Found" };
    }
  }

  @HandleErrors()
  async findAll(queryParams: object): Promise<ApiResponse<T[]>> {
    let data = [];
    if (Object.keys(queryParams).length > 0) {
      const query = await this.repository.createQueryBuilder();
      for (const field in queryParams) {
        if (queryParams.hasOwnProperty(field)) {
          const value = queryParams[field];
          query.andWhere(`${field} = '${value}'`);
        }
      }
      data = await query.getMany();
    } else {
      data = await this.repository.find();
    }
    return { statusCode: 200, status: "success", data: data };
  }

  @HandleErrors()
  async delete(id: string): Promise<ApiResponse<T>> {
    const isExist = await this.findOne(id);
    if (isExist.statusCode === 404) {
      return isExist;
    }

    await this.repository.delete(id);
    return { statusCode: 200, status: "success" };
  }

  @HandleErrors()
  async findByIds(ids: string[]): Promise<ApiResponse<T[]>> {
    const primaryKey: string =
      this.repository.metadata.primaryColumns[0].databaseName;
    const data = await this.repository
      .createQueryBuilder()
      .where(`${primaryKey} IN (:...ids)`, { ids: ids })
      .getMany();
    return { statusCode: 200, status: "success", data: data };
  }

  @HandleErrors()
  async customQuery(query: string): Promise<T[]> {
    const data = await this.repository
      .createQueryBuilder()
      .where(query)
      .getMany();
    return data;
  }

  private buildWhere(id: string): Object {
    const where = {};
    const primaryKey: string =
      this.repository.metadata.primaryColumns[0].databaseName;
    where[primaryKey] = id;
    return where;
  }
}
