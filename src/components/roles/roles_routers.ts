import { Express } from "express";
import { RoleController, RolesUtil } from "./roles_controller";
import { validate } from "../../utils/validator";
import { body } from "express-validator";
import { BaseController } from "../../utils/base_controller";
const validRoleInput = [
  body("name").trim().notEmpty().withMessage("It should have name"),

  body("description")
    .isLength({ max: 200 })
    .withMessage("it should be litmited by 200 characters"),

  body("rights").custom((value: string) => {
    const accessRights = value?.split(",");
    if (accessRights?.length > 0) {
      const validRights = RolesUtil.getAllPermissionsFromRights();
      const areAllRightsValid = accessRights.every((right) =>
        validRights.includes(right)
      );
      if (!areAllRightsValid) {
        throw new Error("Invalid permission");
      }
    }
    return true; // Validation passed
  }),
];
export class RoleRoutes {
  private baseEndPoint = "/api/v1/roles";
  constructor(app: Express) {
    console.log("FROM ROLE ROUTEERS");
    const controller: BaseController = new RoleController();

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
