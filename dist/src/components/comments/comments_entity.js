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
exports.Comments = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("../users/users_entity");
const tasks_entity_1 = require("../tasks/tasks_entity");
let Comments = class Comments {
    commentId;
    comment;
    user_id;
    taskId;
    supported_files;
    createdAt;
    updatedAt;
};
exports.Comments = Comments;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid", { name: "comment_id" }),
    __metadata("design:type", String)
], Comments.prototype, "commentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    __metadata("design:type", String)
], Comments.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => users_entity_1.Users, (userData) => userData.userId),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", String)
], Comments.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => tasks_entity_1.Tasks, (taskData) => taskData.taskId),
    (0, typeorm_1.JoinColumn)({ name: "task_id" }),
    __metadata("design:type", String)
], Comments.prototype, "taskId", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { array: true, default: [] }),
    __metadata("design:type", Array)
], Comments.prototype, "supported_files", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Comments.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], Comments.prototype, "updatedAt", void 0);
exports.Comments = Comments = __decorate([
    (0, typeorm_1.Entity)()
], Comments);
