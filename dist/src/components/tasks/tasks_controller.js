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
exports.TaskController = void 0;
const base_controller_1 = require("../../utils/base_controller");
const tasks_service_1 = require("./tasks_service");
const users_controller_1 = require("../users/users_controller");
const projects_controller_1 = require("../projects/projects_controller");
const permissionHandler_1 = require("../../utils/permissionHandler");
class TaskController extends base_controller_1.BaseController {
    async addHandler(req, res) {
        try {
            const service = new tasks_service_1.TasksService();
            const task = req.body;
            const isValidProject = await projects_controller_1.ProjectsUtil.checkValidProjectIds([
                task.project_id,
            ]);
            if (!isValidProject) {
                res.status(400).json({
                    statusCode: 400,
                    status: 'error',
                    message: 'Invalid project_id',
                });
                return;
            }
            const isValidUser = await users_controller_1.UsersUtil.checkValidUserIds([task.user_id]);
            if (!isValidUser) {
                res.status(400).json({
                    statusCode: 400,
                    status: 'error',
                    message: 'Invalid user_id',
                });
                return;
            }
            const createdTask = await service.create(task);
            res.status(201).json(createdTask);
        }
        catch (error) {
            console.error(`Error while addUser => ${error.message}`);
            res.status(500).json({
                statusCode: 500,
                status: 'error',
                message: 'Internal server error',
            });
        }
    }
    async getAllHandler(req, res) {
        const service = new tasks_service_1.TasksService();
        const result = await service.findAll(req.query);
        res.status(result.statusCode).json(result);
    }
    async getOneHandler(req, res) {
        const service = new tasks_service_1.TasksService();
        const result = await service.findOne(req.params.id);
        res.status(result.statusCode).json(result);
    }
    async updateHandler(req, res) {
        const task = req.body;
        const service = new tasks_service_1.TasksService();
        const result = await service.update(req.params.id, task);
        res.status(result.statusCode).json(result);
    }
    async deleteHandler(req, res) {
        const service = new tasks_service_1.TasksService();
        const result = await service.delete(req.params.id);
        res.status(result.statusCode).json(result);
    }
}
exports.TaskController = TaskController;
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "addHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getAllHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getOneHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "deleteHandler", null);
