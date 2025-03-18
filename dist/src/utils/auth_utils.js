"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.authorize = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const common_1 = require("./common");
const users_controller_1 = require("../components/users/users_controller");
const roles_controller_1 = require("../components/roles/roles_controller");
const authorize = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, common_1.SERVER_CONST.JWTSECRET);
        const { username, email } = decodedToken;
        const { userId, role_id } = await users_controller_1.UsersUtil.getUserFromUsername(username);
        req.user = { username, email, userId };
        if (req.user.username) {
            const user = await users_controller_1.UsersUtil.getUserFromUsername(req.user.username);
            req.user.userId = user.userId;
            req.user.rights = await roles_controller_1.RolesUtil.getAllRightsFromRoles([role_id]);
        }
        next();
    }
    catch (error) {
        next(new Error("Invalid Token"));
    }
};
exports.authorize = authorize;
const hasPermission = (rights, desired_rights) => {
    if (rights?.includes(desired_rights)) {
        return true;
    }
    else {
        return false;
    }
};
exports.hasPermission = hasPermission;
