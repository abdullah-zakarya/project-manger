"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesUtil = exports.RoleController = void 0;
const common_1 = require("../../utils/common");
const roles_service_1 = require("./roles_service");
class RoleController {
    serviceClass;
    constructor() { }
    async addHandler(req, res) {
        const role = req.body;
        const service = new roles_service_1.RolesService();
        const result = await service.create(role);
        res.status(result.statusCode).json(result);
        return;
    }
    async getAllHandler(req, res) {
        const service = new roles_service_1.RolesService();
        const result = await service.findAll(req.query);
        res.status(result.statusCode).json(result);
    }
    async getOneHandler(req, res) {
        const service = new roles_service_1.RolesService();
        const result = await service.findOne(req.params.id);
        res.status(result.statusCode).json(result);
    }
    async updateHandler(req, res) {
        const service = new roles_service_1.RolesService();
        const result = await service.update(req.params.id, req.body);
        res.status(result.statusCode).json(result);
    }
    async deleteHandler(req, res) {
        const service = new roles_service_1.RolesService();
        const result = await service.delete(req.params.id);
        res.status(result.statusCode).json(result);
    }
}
exports.RoleController = RoleController;
class RolesUtil {
    static getAllPermissionsFromRights() {
        let permissions = [];
        for (const module in common_1.Rights) {
            if (common_1.Rights[module]["ALL"]) {
                const sectionValuesString = common_1.Rights[module]["ALL"];
                const sectionValues = sectionValuesString.split(",");
                permissions = [...permissions, ...sectionValues];
            }
        }
        return permissions;
    }
    static async checkValidRoleIds(role_ids) {
        const roleService = new roles_service_1.RolesService();
        const roles = await roleService.findByIds(role_ids);
        if (!roles.data)
            return false;
        return roles.data.length === role_ids.length;
    }
    static async getAllRightsFromRoles(role_ids) {
        const roleService = new roles_service_1.RolesService();
        let rights = [];
        const queryData = await roleService.findByIds(role_ids);
        const roles = queryData.data ? queryData.data : [];
        roles.forEach((role) => {
            const rightFromRole = role?.rights?.split(",");
            rights = [...new Set(rights.concat(rightFromRole))];
        });
        return rights;
    }
}
exports.RolesUtil = RolesUtil;
