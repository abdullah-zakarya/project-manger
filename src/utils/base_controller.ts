import { Request, Response } from "express";
import { BaseService } from "./base_services";
import { RolesService } from "../components/roles/roles_services";
// Old Code --well delete

// export class BaseController {
//   serviceClass: any;
//   constructor(public serviceGetter: () => BaseService<any>) {}

//   service(): BaseService<any> {
//     return this.serviceGetter();
//   }
//   public async addHandler(req: Request, res: Response): Promise<void> {
//     const role = req.body;
//     const service = await this.service();
//     const result = await service.create(role);
//     res.status(result.statusCode).json(result);
//     return;
//   }

//   public async getAllHandler(req: Request, res: Response): Promise<void> {
//     // const service = this.service(); not work
//     const service = this.serviceGetter();
//     // const service = this.serviceClass.getInstance(); // not work
//     // const service = await RolesServieces.getInstance(); // just that work
//     const result = await service.findAll(req.query);
//     res.status(result.statusCode).json(result);
//   }
//   public async getOneHandler(req: Request, res: Response): Promise<void> {
//     const service = await this.service();
//     const result = await service.findOne(req.params.id);
//     res.status(result.statusCode).json(result);
//   }
//   public async updateHandler(req: Request, res: Response): Promise<void> {
//     const service = await this.service();
//     const result = await service.update(req.params.id, req.body);
//     res.status(result.statusCode).json(result);
//   }
//   public async deleteHandler(req: Request, res: Response): Promise<void> {
//     const service = await this.service();
//     const result = await service.delete(req.params.id);
//     res.status(result.statusCode).json(result);
//   }
// }

export abstract class BaseController {
  public abstract addHandler(req: Request, res: Response): void;
  public abstract getAllHandler(req: Request, res: Response): void;
  public abstract getOneHandler(req: Request, res: Response): void;
  public abstract updateHandler(req: Request, res: Response): void;
  public abstract deleteHandler(req: Request, res: Response): void;
}
