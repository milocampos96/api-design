import { validationResult } from "express-validator";

/**
 * A middleware function to handle input validation errors in Express.js applications.
 * It uses the `express-validator` library to validate request data.
 *
 * @param {import('express').Request} req - The Express.js request object.
 * @param {import('express').Response} res - The Express.js response object.
 * @param {import('express').NextFunction} next - The Express.js next middleware function.
 *
 * @returns {void}
 *
 * @remarks
 * This middleware function should be used after applying validation rules using `express-validator`'s `check` or `body` functions.
 * If any validation errors occur, it sends a 400 Bad Request response with an array of error objects.
 * Otherwise, it calls the next middleware function.
 */
export const handleInputErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
