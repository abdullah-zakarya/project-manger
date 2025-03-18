"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleErrors = HandleErrors;
function HandleErrors() {
  return function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        console.log("from decorator : Error Handler; \n" + propertyKey);
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
