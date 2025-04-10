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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const roles_entity_1 = require("../roles/roles_entity");
let Users = class Users {
    userId;
    fullname;
    username;
    email;
    password;
    role_id;
    createdAt;
    updatedAt;
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid', { name: 'user_id' }),
    __metadata("design:type", String)
], Users.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "fullname", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: false, unique: true }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 60, nullable: false, unique: true }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    (0, typeorm_1.ManyToOne)(() => roles_entity_1.Roles),
    (0, typeorm_1.JoinColumn)({ name: 'role_id' }),
    __metadata("design:type", Object)
], Users.prototype, "role_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Users.prototype, "updatedAt", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)()
], Users);
