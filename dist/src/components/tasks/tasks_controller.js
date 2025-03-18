"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const auth_utils_1 = require("../../utils/auth_utils");
const base_controller_1 = require("../../utils/base_controller");
const tasks_service_1 = require("./tasks_service");
const users_controller_1 = require("../users/users_controller");
const projects_controller_1 = require("../projects/projects_controller");
class TaskController extends base_controller_1.BaseController {
    async addHandler(req, res) {
        if (!(0, auth_utils_1.hasPermission)(req.user.rights, "add_task")) {
            res
                .status(403)
                .json({ statusCode: 403, status: "error", message: "  Q" });
            return;
        }
        try {
            const service = new tasks_service_1.TasksService();
            const task = req.body;
            const isValidProject = await projects_controller_1.ProjectsUtil.checkValidProjectIds([
                task.project_id,
            ]);
            if (!isValidProject) {
                res.status(400).json({
                    statusCode: 400,
                    status: "error",
                    message: "Invalid project_id",
                });
                return;
            }
            const isValidUser = await users_controller_1.UsersUtil.checkValidUserIds([task.user_id]);
            if (!isValidUser) {
                res.status(400).json({
                    statusCode: 400,
                    status: "error",
                    message: "Invalid user_id",
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
                status: "error",
                message: "Internal server error",
            });
        }
    }
    async getAllHandler(req, res) {
        if (!(0, auth_utils_1.hasPermission)(req.user.rights, "get_all_tasks")) {
            res
                .status(403)
                .json({ statusCode: 403, status: "error", message: "Unauthorised" });
            return;
        }
        const service = new tasks_service_1.TasksService();
        const result = await service.findAll(req.query);
        res.status(result.statusCode).json(result);
    }
    async getOneHandler(req, res) {
        if (!(0, auth_utils_1.hasPermission)(req.user.rights, "get_details_task")) {
            res
                .status(403)
                .json({ statusCode: 403, status: "error", message: "Unauthorised" });
        }
        const service = new tasks_service_1.TasksService();
        const result = await service.findOne(req.params.id);
        res.status(result.statusCode).json(result);
    }
    async updateHandler(req, res) {
        if (!(0, auth_utils_1.hasPermission)(req.user.rights, "edit_task")) {
            res
                .status(403)
                .json({ statusCode: 403, status: "error", message: "Unauthorised" });
            return;
        }
        const task = req.body;
        const service = new tasks_service_1.TasksService();
        const result = await service.update(req.params.id, task);
        res.status(result.statusCode).json(result);
    }
    async deleteHandler(req, res) {
        if (!(0, auth_utils_1.hasPermission)(req.user.rights, "delete_task")) {
            res
                .status(403)
                .json({ statusCode: 403, status: "error", message: "Unauthorised" });
            return;
        }
        const service = new tasks_service_1.TasksService();
        const result = await service.delete(req.params.id);
        res.status(result.statusCode).json(result);
    }
}
exports.TaskController = TaskController;
