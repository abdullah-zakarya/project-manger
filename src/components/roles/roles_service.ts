import { BaseService } from "../../utils/base_services";
import { Roles } from "./roles_entity";
import { DatabaseUtil } from "../../utils/db";
import { Repository } from "typeorm";

export class RolesService extends BaseService<Roles> {
  private static instance: RolesService;

  constructor() {
    const databaseUtil = new DatabaseUtil();
    const roleRepository = databaseUtil.getRepository(Roles);
    super(roleRepository as Repository<Roles>);
  }
}
