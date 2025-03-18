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
exports.ProjectsUtil = exports.ProjectController = void 0;
const projects_service_1 = require("./projects_service");
const users_controller_1 = require("../users/users_controller");
const base_controller_1 = require("../../utils/base_controller");
const permissionHandler_1 = require("utils/permissionHandler");
class ProjectController extends base_controller_1.BaseController {
    async addHandler(req, res) {
        const service = new projects_service_1.ProjectsService();
        const project = req.body;
        const isValidUsers = await users_controller_1.UsersUtil.checkValidUserIds(project.user_ids);
        if (!isValidUsers) {
            res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Invalid user_ids",
            });
            return;
        }
        const createdProject = await service.create(project);
        res.status(createdProject.statusCode).json(createdProject);
    }
    async getAllHandler(req, res) {
        const service = new projects_service_1.ProjectsService();
        const result = await service.findAll(req.query);
        for (const project of result.data) {
            project["users"] = await users_controller_1.UsersUtil.getUsernamesById(project.user_ids);
            delete project.user_ids;
        }
        res.status(result.statusCode).json(result);
    }
    async getOneHandler(req, res) {
        const service = new projects_service_1.ProjectsService();
        const result = await service.findOne(req.params.id);
        result.data["users"] = await users_controller_1.UsersUtil.getUsernamesById(result.data.user_ids);
        delete result.data.user_ids;
        res.status(result.statusCode).json(result);
    }
    async updateHandler(req, res) {
        const project = req.body;
        const service = new projects_service_1.ProjectsService();
        const result = await service.update(req.params.id, project);
        res.status(result.statusCode).json(result);
    }
    async deleteHandler(req, res) {
        const service = new projects_service_1.ProjectsService();
        const result = await service.delete(req.params.id);
        res.status(result.statusCode).json(result);
    }
}
exports.ProjectController = ProjectController;
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "addHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getAllHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "getOneHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "updateHandler", null);
__decorate([
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProjectController.prototype, "deleteHandler", null);
class ProjectsUtil {
    static async checkValidProjectIds(project_ids) {
        const projectService = new projects_service_1.ProjectsService();
        const projects = await projectService.findByIds(project_ids);
        return projects.data.length === project_ids.length;
    }
}
exports.ProjectsUtil = ProjectsUtil;
