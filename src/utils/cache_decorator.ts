import { stat } from 'fs';
import { CacheUtil } from './cache_util';

function cacheDecorator(paramKey: string, statusCode: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const className = target.constructor.name.slice(0, -10);
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: any, res: any, next: any) {
      try {
        const paramValue = req.params[paramKey];
        const data = await CacheUtil.get(className, paramValue);
        res.status(statusCode).json({ status: 'success', statusCode, data });
      } catch (error) {
        console.log('error', error);
        const result = await originalMethod.call(this, req, res, next);
        return result;
      }
    };

    return descriptor;
  };
}
