"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRoutes = void 0;
const roles_controller_1 = require("./roles_controller");
const express_validator_1 = require("express-validator");
const validRoleInput = [
  (0, express_validator_1.body)("name")
    .trim()
    .notEmpty()
    .withMessage("It should have name"),
  (0, express_validator_1.body)("description")
    .isLength({ max: 200 })
    .withMessage("it should be limited by 200 characters"),
  (0, express_validator_1.body)("rights").custom((value) => {
    const accessRights = value?.split(",");
    if (accessRights?.length > 0) {
      const validRights =
        roles_controller_1.RolesUtil.getAllPermissionsFromRights();
      const areAllRightsValid = accessRights.every((right) =>
        validRights.includes(right)
      );
      if (!areAllRightsValid) {
        throw new Error("Invalid permission");
      }
    }
    return true;
  }),
];
class RoleRoutes {
  baseEndPoint = "/api/v1/roles";
  constructor(app) {
    const controller = new roles_controller_1.RoleController();
    app
      .route(this.baseEndPoint)
      .get(controller.getAllHandler)
      .post(controller.addHandler);
    app
      .route(this.baseEndPoint + "/:id")
      .get(controller.getOneHandler)
      .put(controller.updateHandler)
      .delete(controller.deleteHandler);
  }
}
exports.RoleRoutes = RoleRoutes;
