import { validationResult } from 'express-validator';

/**
 * Formats express-validator validation results into uniform error responses
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Input validation failed',
      errors: formattedErrors,
    });
  }
  next();
};
