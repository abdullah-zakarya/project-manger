"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const base_services_1 = require("../../utils/base_services");
const roles_entity_1 = require("./roles_entity");
const db_1 = require("../../utils/db");
class RolesService extends base_services_1.BaseService {
    static instance;
    constructor() {
        const databaseUtil = new db_1.DatabaseUtil();
        const roleRepository = databaseUtil.getRepository(roles_entity_1.Roles);
        super(roleRepository);
    }
}
exports.RolesService = RolesService;
