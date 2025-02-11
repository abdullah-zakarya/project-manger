export function HandleErrors() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
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
