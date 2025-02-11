import { Request, Response } from "express";
import { BaseController } from "../../utils/base_controller";
import { Rights } from "../../utils/common";
import { RolesServieces } from "./roles_services";
import { promises } from "dns";
export class RoleController extends BaseController {
  public async addHandler(req: Request, res: Response): Promise<void> {
    const role = req.body;
    const service = new RolesServieces();
    const result = await service.create(role);
    res.status(result.statusCode).json(result);
    return;
  }

  public async getAllHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesServieces();
    const result = await service.findAll(req.query);
    res.status(result.statusCode).json(result);
  }
  public async getOneHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesServieces();
    const result = await service.findOne(req.params.id);
    res.status(result.statusCode).json(result);
  }
  public async updateHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesServieces();
    const result = await service.update(req.params.id, req.body);
    res.status(result.statusCode).json(result);
  }
  public async deleteHandler(req: Request, res: Response): Promise<void> {
    const service = new RolesServieces();
    const result = await service.delete(req.params.id);
    res.status(result.statusCode).json(result);
  }
}
export class RolesUtil {
  public static getAllPermissionsFromRights(): string[] {
    let permissions = [];
    for (const module in Rights) {
      if (Rights[module]["ALL"]) {
        let sectionValues = Rights[module]["ALL"];
        sectionValues = sectionValues.split(",");
        permissions = [...permissions, ...sectionValues];
      }
    }
    return permissions;
  }
}
