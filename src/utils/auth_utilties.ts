import * as jwt from "jsonwebtoken";
import { SERVER_CONST } from "./common";
import { UsersUtil } from "../components/users/users_controller";
import { RolesUtil } from "../components/roles/roles_controller";
import { NextFunction, Request, Response } from "express";
import { Users } from "../components/users/users_entity";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
      // return next(new Error("Missing Authorization Token"));
    }

    const decodedToken = jwt.verify(token, SERVER_CONST.JWTSECRET);
    const { username, email } = decodedToken as {
      username: string;
      email: string;
    };

    const { userId, role_id } = await UsersUtil.getUserFromUsername(username);
    req.user = { username, email, userId };

    if (req.user.username) {
      const user = await UsersUtil.getUserFromUsername(req.user.username);
      req.user.userId = user.userId;
      req.user.rights = await RolesUtil.getAllRightsFromRoles([role_id]);
    }

    next();
  } catch (error) {
    next(new Error("Invalid Token"));
  }
};

export const hasPermission = (
  rights: string[],
  desired_rights: string
): boolean => {
  if (rights?.includes(desired_rights)) {
    return true;
  } else {
    return false;
  }
};
