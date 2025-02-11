import { Request, Response } from "express";
import { BaseService } from "./base_services";
export abstract class BaseController {
  public abstract addHandler(req: Request, res: Response): void;
  public abstract getAllHandler(req: Request, res: Response): void;
  public abstract getOneHandler(req: Request, res: Response): void;
  public abstract updateHandler(req: Request, res: Response): void;
  public abstract deleteHandler(req: Request, res: Response): void;
}
