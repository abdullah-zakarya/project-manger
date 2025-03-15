import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      username: string;
      email: string;
      rights?: string[];
    };
  }
}
