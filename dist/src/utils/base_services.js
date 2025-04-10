"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const error_handler_1 = require("./error_handler");
class BaseService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(entity) {
        const createdEntity = this.repository.create(entity);
        const savedEntity = await this.repository.save(createdEntity);
        return { statusCode: 201, status: 'success', data: savedEntity };
    }
    async update(id, updateData) {
        const exist = await this.findOne(id);
        if (!exist || exist.statusCode === 404)
            return exist;
        const where = this.buildWhere(id);
        const validColumns = this.repository.metadata.columns.map((col) => col.propertyName);
        const query = {};
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
    async findOne(id) {
        const where = this.buildWhere(id);
        const data = await this.repository.findOne({ where });
        if (data)
            return { statusCode: 200, status: 'success', data };
        return { statusCode: 404, status: 'error', message: 'Not Found' };
    }
    async findAll(queryParams) {
        let data;
        if (Object.keys(queryParams).length > 0) {
            const query = this.repository.createQueryBuilder();
            for (const field in queryParams) {
                query.andWhere(`${field} = :value`, { value: queryParams[field] });
            }
            data = await query.getMany();
        }
        else {
            data = await this.repository.find();
        }
        return { statusCode: 200, status: 'success', data };
    }
    async delete(id) {
        const exist = await this.findOne(id);
        if (!exist || exist.statusCode === 404)
            return exist;
        await this.repository.delete(id);
        return { statusCode: 200, status: 'success' };
    }
    async findByIds(ids) {
        const data = await this.repository
            .createQueryBuilder()
            .whereInIds(ids)
            .getMany();
        return { statusCode: 200, status: 'success', data: data };
    }
    async customQuery(query) {
        try {
            const data = await this.repository
                .createQueryBuilder()
                .where(query)
                .getMany();
            return data;
        }
        catch (error) {
            console.error(`Error while executing custom query: ${query}`, error);
            return [];
        }
    }
    buildWhere(id) {
        const primaryKey = this.repository.metadata.primaryColumns[0].propertyName;
        return { [primaryKey]: id };
    }
}
exports.BaseService = BaseService;
__decorate([
    (0, error_handler_1.HandleErrors)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "create", null);
__decorate([
    (0, error_handler_1.HandleErrors)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "update", null);
__decorate([
    (0, error_handler_1.HandleErrors)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "findOne", null);
__decorate([
    (0, error_handler_1.HandleErrors)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "findAll", null);
__decorate([
    (0, error_handler_1.HandleErrors)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "delete", null);
__decorate([
    (0, error_handler_1.HandleErrors)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BaseService.prototype, "findByIds", null);
