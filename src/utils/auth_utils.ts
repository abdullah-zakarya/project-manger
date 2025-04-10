import * as jwt from 'jsonwebtoken';
import { SERVER_CONST } from './common';
import { UsersUtil } from '../components/users/users_controller';
import { RolesUtil } from '../components/roles/roles_controller';
import { NextFunction, Request, Response } from 'express';

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void | any> => {
  try {
    const [type, token] = req.headers.authorization?.split(' ');

    if (!token || type !== 'Bearer') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = jwt.verify(token, SERVER_CONST.JWTSECRET);
    const { username, email } = decodedToken as {
      username: string;
      email: string;
    };

    const { userId, roleId } = await UsersUtil.getUserFromUsername(username);
    req.user = { username, email, userId };

    if (req.user.username) {
      const user = await UsersUtil.getUserFromUsername(req.user.username);
      req.user.userId = user.userId;
      req.user.rights = await RolesUtil.getAllRightsFromRoles([roleId]);
    }

    next();
  } catch (error) {
    res
      .status(401)
      .json({ statusCode: 401, status: 'error', message: 'invalid token' });
  }
};

export const hasPermission = (
  rights: string[],
  desired_rights: string,
): boolean => {
  if (rights?.includes(desired_rights)) {
    return true;
  } else {
    return false;
  }
};
