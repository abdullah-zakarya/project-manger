import { Repository } from "typeorm";
import { BaseService } from "../../utils/base_services";
import { DataSource } from "typeorm";
import { Roles } from "./roles_entity";
import { DatabaseUtil } from "../../utils/db";

export class RolesServieces extends BaseService<Roles> {
  constructor() {
    const databaseUtil = new DatabaseUtil();
    const roleRepository = databaseUtil.getRepository(Roles);
    super(roleRepository);
  }
}
