"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty())
            return next();
        const errorMessage = errors.array().map((error) => {
            const obj = {};
            obj[error.path] = error.msg;
            return obj;
        });
        res
            .status(400)
            .json({ statusCode: 400, status: 'error', errors: errorMessage });
    };
};
exports.validate = validate;
