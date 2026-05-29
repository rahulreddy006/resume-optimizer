import {AppError} from '../utils/AppError.js';

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // If Zod fails, extract the first error message and throw a 400 Bad Request
    const message = error.issues.map(err => err.message).join(', ');
    next(new AppError(`Validation Error: ${message}`, 400));
  }
};

export default validate;