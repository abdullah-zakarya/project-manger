import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export interface IValidationError {
  type?: string;
  msg?: string;
  path?: string;
  location?: string;
}
// validate the request input using express-validator
export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(() => (validate) => validate.run(req)));
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const errorMessage = errors.array().map((error: IValidationError) => {
      const obj = {};
      obj[error.path] = error.msg;
      return obj;
    });

    res
      .status(400)
      .json({ statusCode: 400, status: "error", errors: errorMessage });
  };
};
