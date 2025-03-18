"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionHandler = permissionHandler;
const auth_utils_1 = require("./auth_utils");
function permissionHandler() {
  return function (target, propertyKey, descriptor) {
    const permissionName =
      target.constructor.name.slice(0, -10) + propertyKey.slice(0, -7);
    console.log(`Checking permission: ${permissionName}`);
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      if (!args[0] || !args[1]) {
        throw new Error("Invalid arguments: req and res must be provided.");
      }
      const req = args[0];
      const res = args[1];
      if (
        !req.user ||
        !(0, auth_utils_1.hasPermission)(req.user.rights, permissionName)
      ) {
        res.status(403).json({
          statusCode: 403,
          status: "error",
          message: "Unauthorised",
        });
        return;
      }
      const result = await originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
