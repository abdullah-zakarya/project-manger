"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const base_services_1 = require("../../utils/base_services");
const db_1 = require("../../utils/db");
const projects_entity_1 = require("./projects_entity");
class ProjectsService extends base_services_1.BaseService {
    constructor() {
        let projectRepository = null;
        projectRepository = new db_1.DatabaseUtil().getRepository(projects_entity_1.Projects);
        super(projectRepository);
    }
}
exports.ProjectsService = ProjectsService;
