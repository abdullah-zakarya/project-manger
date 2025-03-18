"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const base_services_1 = require("../../utils/base_services");
const db_1 = require("../../utils/db");
const tasks_entity_1 = require("./tasks_entity");
class TasksService extends base_services_1.BaseService {
    taskRepository = null;
    constructor() {
        let taskRepository = null;
        taskRepository = new db_1.DatabaseUtil().getRepository(tasks_entity_1.Tasks);
        super(taskRepository);
        this.taskRepository = taskRepository;
    }
    async findAll(queryParams) {
        const queryBuilder = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoin("task.project_id", "project")
            .leftJoin("task.user_id", "user")
            .addSelect([
            "task.*",
            "task.project_id as project",
            "project.project_id",
            "project.name",
            "user.user_id",
            "user.username",
            "user.email",
        ]);
        if (queryParams["username"]) {
            queryBuilder.andWhere("user.username ILIKE :userName", {
                userName: `%${queryParams["username"]}%`,
            });
        }
        if (queryParams["projectname"]) {
            queryBuilder.andWhere("project.name ILIKE :projectName", {
                projectName: `%${queryParams["projectname"]}%`,
            });
        }
        if (queryParams["project_id"]) {
            queryBuilder.andWhere("task.project_id = :projectId", {
                projectId: queryParams["project_id"],
            });
        }
        const data = await queryBuilder.getMany();
        data.forEach((item) => {
            item["projectDetails"] = item.projectId;
            item["userDetails"] = item.userId;
            delete item.projectId;
            delete item.userId;
        });
        return { statusCode: 200, status: "success", data: data };
    }
    async findOne(id) {
        try {
            const where = {};
            const primaryKey = this.taskRepository.metadata.primaryColumns[0].databaseName;
            where[primaryKey] = id;
            const data = await this.taskRepository
                .createQueryBuilder("task")
                .leftJoin("task.project_id", "project")
                .leftJoin("task.user_id", "user")
                .addSelect([
                "task.*",
                "task.project_id as project",
                "project.project_id",
                "project.name",
                "user.user_id",
                "user.username",
                "user.email",
            ])
                .where(where)
                .getOne();
            if (data) {
                data["projectDetails"] = data.projectId;
                data["userDetails"] = data.userId;
                delete data.projectId;
                delete data.userId;
                return { statusCode: 200, status: "success", data: data };
            }
            else {
                return { statusCode: 404, status: "error", message: "Not Found" };
            }
        }
        catch (error) {
            return { statusCode: 500, status: "error", message: error.message };
        }
    }
}
exports.TasksService = TasksService;
