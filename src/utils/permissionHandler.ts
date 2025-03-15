import { hasPermission } from "./auth_utilties";
import { ApiResponse } from "./base_services";

export function permissionHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // Construct permission name based on class and method names
    const permissionName =
      target.constructor.name.slice(0, -10) + propertyKey.slice(0, -7);
    console.log(`Checking permission: ${permissionName}`);

    const originalMethod = descriptor.value;

    descriptor.value = async function (
      ...args: any[]
    ): Promise<ApiResponse<any>> {
      // Ensure args[0] and args[1] exist
      if (!args[0] || !args[1]) {
        throw new Error("Invalid arguments: req and res must be provided.");
      }

      const req = args[0]; // Assuming args[0] is the request object
      const res = args[1]; // Assuming args[1] is the response object

      // Check if the user has the required permission
      if (!req.user || !hasPermission(req.user.rights, permissionName)) {
        res.status(403).json({
          statusCode: 403,
          status: "error",
          message: "Unauthorised",
        });
        return; // Stop further execution
      }

      // Call the original method if permission is granted
      const result = await originalMethod.apply(this, args);
      return result;
    };

    return descriptor;
  };
}
