import { ApiResponse } from "./base_services";

export function HandleErrors() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      ...args: any[]
    ): Promise<ApiResponse<any>> {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error: any) {
        console.log("from decorator : Erorr Handler; \n" + propertyKey);
        return {
          statusCode: 500,
          status: "error",
          message: error.message,
        };
      }
    };

    return descriptor;
  };
}
