import { Request, Response } from "express";
import { BaseController } from "../../utils/base_controller";
import { Rights } from "../../utils/common";
import { RolesService } from "./roles_service";
import { promises } from "dns";
import { Roles } from "./roles_entity";
import { ApiResponse } from "../../utils/base_services";
// export class RoleController extends BaseController {
//   private constructor(service: any) {
//     super(service);
//   }
//   public static async getInstance(): Promise<RoleController> {
//     return new RoleController(() => RolesServieces.getInstance());
//   }
// }
export class RoleController {
  serviceClass: any;
  constructor() {}

  public async addHandler(req: Request, res: Response): Promise<void> {
    const role = req.body;
    const service = new RolesService();
    const result: ApiResponse<Roles> = await service.create(role);
    res.status(result.statusCode).json(result);
    return;
  }

  public async getAllHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesService();
    const result: ApiResponse<Roles[]> = await service.findAll(req.query);
    res.status(result.statusCode).json(result);
  }
  public async getOneHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesService();
    const result: ApiResponse<Roles> = await service.findOne(req.params.id);
    res.status(result.statusCode).json(result);
  }
  public async updateHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesService();
    const result: ApiResponse<Roles> = await service.update(
      req.params.id,
      req.body
    );
    res.status(result.statusCode).json(result);
  }
  public async deleteHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesService();
    const result = await service.delete(req.params.id);
    res.status(result.statusCode).json(result);
  }
}

export class RolesUtil {
  /**
   * Retrieves all possible permissions from the defined rights in the Rights object.
   * @returns {string[]} An array of permissions
   */
  public static getAllPermissionsFromRights(): string[] {
    let permissions: string[] = [];
    for (const module in Rights) {
      if (Rights[module]["ALL"]) {
        const sectionValuesString = Rights[module]["ALL"];
        const sectionValues = sectionValuesString.split(",");
        permissions = [...permissions, ...sectionValues];
      }
    }
    // Return the collected permissions
    return permissions;
  }

  public static async checkValidRoleIds(role_ids: string[]) {
    const roleService = new RolesService();

    const roles = await roleService.findByIds(role_ids);
    if (!roles.data) return false;
    return roles.data.length === role_ids.length;
  }

  public static async getAllRightsFromRoles(
    role_ids: string[]
  ): Promise<string[]> {
    const roleService = new RolesService();
    let rights: string[] = [];

    const queryData = await roleService.findByIds(role_ids);
    const roles: Roles[] = queryData.data ? queryData.data : [];

    roles.forEach((role) => {
      const rightFromRole: string[] = role?.rights?.split(",");
      rights = [...new Set<string>(rights.concat(rightFromRole))];
    });

    // Return the accumulated rights
    return rights;
  }
}
