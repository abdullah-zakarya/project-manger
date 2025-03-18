"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create ?
    function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (
        !desc ||
        ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
      ) {
        desc = {
          enumerable: true,
          get: function () {
            return m[k];
          },
        };
      }
      Object.defineProperty(o, k2, desc);
    }
  : function (o, m, k, k2) {
      if (k2 === undefined) k2 = k;
      o[k2] = m[k];
    });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create ?
    function (o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }
  : function (o, v) {
      o["default"] = v;
    });
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3 ? target
        : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key))
        : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r =
            (c < 3 ? d(r)
            : c > 3 ? d(target, key, r)
            : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersUtil = exports.UserController = void 0;
const base_controller_1 = require("../../utils/base_controller");
const common_1 = require("../../utils/common");
const roles_controller_1 = require("../roles/roles_controller");
const users_service_1 = require("./users_service");
const jwt = __importStar(require("jsonwebtoken"));
const email_util_1 = require("../../utils/email_util");
const permissionHandler_1 = require("../../utils/permissionHandler");
class UserController extends base_controller_1.BaseController {
  async addHandler(req, res) {
    try {
      const service = new users_service_1.UsersService();
      const user = req.body;
      const isValidRole = await roles_controller_1.RolesUtil.checkValidRoleIds([
        user.role_id,
      ]);
      if (!isValidRole) {
        res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Invalid role_ids",
        });
        return;
      }
      user.email = user.email?.toLowerCase();
      user.username = user.username?.toLowerCase();
      user.password = await (0, common_1.encryptString)(user.password);
      const createdUser = await service.create(user);
      res.status(createdUser.statusCode).json(createdUser);
    } catch (error) {
      console.error(`Error while addUser => ${error.message}`);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Internal server error",
      });
    }
  }
  async getAllHandler(req, res) {
    const service = new users_service_1.UsersService();
    const result = await service.findAll(req.query);
    if (result.statusCode === 200) {
      result.data.forEach((i) => delete i.password);
    }
    res.status(result.statusCode).json(result);
    return;
  }
  async getOneHandler(req, res) {
    const service = new users_service_1.UsersService();
    const result = await service.findOne(req.params.id);
    if (result.statusCode === 200) {
      delete result.data.password;
    }
    res.status(result.statusCode).json(result);
    return;
  }
  async updateHandler(req, res) {
    const service = new users_service_1.UsersService();
    const user = req.body;
    delete user?.email;
    delete user?.username;
    delete user?.password;
    const result = await service.update(req.params.id, user);
    if (result.statusCode === 200) {
      delete result.data.password;
    }
    res.status(result.statusCode).json(result);
    return;
  }
  async deleteHandler(req, res) {
    const service = new users_service_1.UsersService();
    const result = await service.delete(req.params.id);
    res.status(result.statusCode).json(result);
    return;
  }
  async login(req, res) {
    const { email, password } = req.body;
    const service = new users_service_1.UsersService();
    const result = await service.findAll({ email: email });
    if (result.data.length < 1) {
      res
        .status(404)
        .json({ statusCode: 404, status: "error", message: "Email not found" });
      return;
    } else {
      const user = result.data[0];
      const comparePasswords = await (0, common_1.bcryptCompare)(
        password,
        user.password
      );
      if (!comparePasswords) {
        res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Password is not valid",
        });
        return;
      }
      const accessToken = jwt.sign(
        {
          email: user.email,
          username: user.username,
        },
        common_1.SERVER_CONST.JWTSECRET,
        { expiresIn: common_1.SERVER_CONST.ACCESS_TOKEN_EXPIRY_TIME_SECONDS }
      );
      const refreshToken = jwt.sign(
        {
          email: user.email,
          username: user.username,
        },
        common_1.SERVER_CONST.JWTSECRET,
        { expiresIn: common_1.SERVER_CONST.REFRESH_TOKEN_EXPIRY_TIME_SECONDS }
      );
      res.status(200).json({
        statusCode: 200,
        status: "success",
        data: { accessToken, refreshToken },
      });
      return;
    }
  }
  async getAccessTokenFromRefreshToken(req, res) {
    const refreshToken = req.body.refreshToken;
    jwt.verify(refreshToken, common_1.SERVER_CONST.JWTSECRET, (err, user) => {
      if (err) {
        res.status(403).json({
          statusCode: 403,
          status: "error",
          message: "Invalid Refresh Token",
        });
        return;
      }
      const accessToken = jwt.sign(user, common_1.SERVER_CONST.JWTSECRET, {
        expiresIn: common_1.SERVER_CONST.ACCESS_TOKEN_EXPIRY_TIME_SECONDS,
      });
      res
        .status(200)
        .json({ statusCode: 200, status: "success", data: { accessToken } });
      return;
    });
  }
  async changePassword(req, res) {
    const { oldPassword, newPassword } = req.body;
    const service = new users_service_1.UsersService();
    const findUserResult = await service.findOne(req.params.id);
    if (findUserResult.statusCode !== 200) {
      res
        .status(404)
        .send({ statusCode: 404, status: "error", message: "User Not Found" });
      return;
    }
    const user = findUserResult.data;
    if (user?.username !== req.user.username) {
      res.status(400).send({
        statusCode: 400,
        status: "error",
        message: "User can change only own password",
      });
      return;
    }
    const comparePasswords = await (0, common_1.bcryptCompare)(
      oldPassword,
      user.password
    );
    if (!comparePasswords) {
      res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "oldPassword is not matched",
      });
      return;
    }
    user.password = await (0, common_1.encryptString)(newPassword);
    const result = await service.update(req.params.id, user);
    if (result.statusCode === 200) {
      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Password is updated successfully",
      });
      return;
    } else {
      res.status(result.statusCode).json(result);
      return;
    }
  }
  async forgotPassword(req, res) {
    const { email } = req.body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      res
        .status(400)
        .send({ statusCode: 400, status: "error", message: "Invalid email" });
      return;
    }
    const user = await UsersUtil.getUserByEmail(email);
    if (!user) {
      res
        .status(404)
        .send({ statusCode: 404, status: "error", message: "User Not Found" });
      return;
    }
    const resetToken = jwt.sign(
      { email: user.email },
      common_1.SERVER_CONST.JWTSECRET,
      {
        expiresIn: "1h",
      }
    );
    const resetLink = `localhost:3000/users/reset-password?token=${resetToken}`;
    const mailOptions = {
      to: email,
      subject: "Password Reset",
      html: ` Hello ${user.username},<p>We received a request to reset your password. If you didn't initiate this request, please ignore this email.</p>
           <p>To reset your password, please click the link below:</p>
           <p><a href="${resetLink}" style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; display: inline-block;">Reset Password</a></p>
           <p>If the link doesn't work, you can copy and paste the following URL into your browser:</p>
           <p>${resetLink}</p>
           <p>This link will expire in 1 hour for security reasons.</p>
           <p>If you didn't request a password reset, you can safely ignore this email.</p>
           <p>Best regards,<br>PMS Team</p>`,
    };
    const emailStatus = await (0, email_util_1.sendMail)(
      mailOptions.to,
      mailOptions.subject,
      mailOptions.html
    );
    if (emailStatus) {
      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Reset Link sent on your mailId",
        data: { resetToken: resetToken },
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "something went wrong try again",
      });
    }
    return;
  }
  async resetPassword(req, res) {
    const { newPassword, token } = req.body;
    const service = new users_service_1.UsersService();
    let email;
    try {
      const decoded = jwt.verify(token, common_1.SERVER_CONST.JWTSECRET);
      if (!decoded) {
        throw new Error("Invalid Reset Token");
      }
      email = decoded["email"];
    } catch (error) {
      res
        .status(400)
        .json({
          statusCode: 400,
          status: "error",
          message: "Reset Token is invalid or expired",
        })
        .end();
      return;
    }
    try {
      const user = await UsersUtil.getUserByEmail(email);
      if (!user) {
        res
          .status(404)
          .json({ statusCode: 404, status: "error", message: "User not found" })
          .end();
        return;
      }
      user.password = await (0, common_1.encryptString)(newPassword);
      const result = await service.update(user.userId, user);
      if (result.statusCode === 200) {
        res.status(200).json({
          statusCode: 200,
          status: "success",
          message: "Password updated successfully",
        });
      } else {
        res.status(result.statusCode).json(result).end();
      }
    } catch (error) {
      console.error(`Error while resetPassword => ${error.message}`);
      res
        .status(500)
        .json({
          statusCode: 500,
          status: "error",
          message: "Internal Server error",
        })
        .end();
    }
  }
}
exports.UserController = UserController;
__decorate(
  [
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise),
  ],
  UserController.prototype,
  "addHandler",
  null
);
__decorate(
  [
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise),
  ],
  UserController.prototype,
  "getAllHandler",
  null
);
__decorate(
  [
    (0, permissionHandler_1.permissionHandler)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise),
  ],
  UserController.prototype,
  "deleteHandler",
  null
);
class UsersUtil {
  static async getUserFromUsername(username) {
    try {
      if (username) {
        const service = new users_service_1.UsersService();
        const users = await service.customQuery(`username = '${username}'`);
        if (users && users.length > 0) {
          return users[0];
        }
      }
    } catch (error) {
      console.error(`Error while getUserFromToken() => ${error.message}`);
    }
    return null;
  }
  static async getUserByEmail(email) {
    try {
      if (email) {
        const service = new users_service_1.UsersService();
        const users = await service.customQuery(`email = '${email}'`);
        if (users && users.length > 0) {
          return users[0];
        }
      }
    } catch (error) {
      console.error(`Error while getUserFromToken() => ${error.message}`);
    }
    return null;
  }
  static async checkValidUserIds(user_ids) {
    const userService = new users_service_1.UsersService();
    const users = await userService.findByIds(user_ids);
    return users.data.length === user_ids.length;
  }
  static async getUsernamesById(user_ids) {
    const userService = new users_service_1.UsersService();
    const queryResult = await userService.findByIds(user_ids);
    if (queryResult.statusCode === 200) {
      const users = queryResult.data;
      const usernames = users.map((i) => {
        return {
          username: i.username,
          user_id: i.userId,
        };
      });
      return usernames;
    }
    return [];
  }
}
exports.UsersUtil = UsersUtil;
