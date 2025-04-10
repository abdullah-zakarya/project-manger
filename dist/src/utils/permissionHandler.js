"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionHandler = permissionHandler;
const auth_utils_1 = require("./auth_utils");
function permissionHandler() {
    return function (target, propertyKey, descriptor) {
        const className = target.constructor.name.slice(0, -10).toLowerCase();
        const methodName = propertyKey.slice(0, -7).toLocaleLowerCase();
        let permissionName = methodName + '_' + className;
        if (methodName === 'getall')
            permissionName = 'get_all_' + className + 's';
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            if (!args[0] || !args[1]) {
                throw new Error('Invalid arguments: req and res must be provided.');
            }
            const req = args[0];
            const res = args[1];
            if (!req.user || !(0, auth_utils_1.hasPermission)(req.user.rights, permissionName)) {
                res.status(403).json({
                    statusCode: 403,
                    status: 'error',
                    message: 'Unauthorised',
                });
                return;
            }
            const result = await originalMethod.apply(this, args);
            return result;
        };
        return descriptor;
    };
}
