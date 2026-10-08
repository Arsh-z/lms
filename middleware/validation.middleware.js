import { body, param, query, validationResult } from "express-validator";

export const validate = (validations) => {
  return async (req, res, next) => {
    //run all validation
    await Promise.all(validations.map(validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedError = errors.array().map((err) => ({
      field: error.path,
      message: error.msg,
    }));

    throw new Error("validation error");
  };
};

export const commonValidation = {
    pagination: [
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be a positive number"),
        query("limit")
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage("Limit must be between 1 and 100"),
    ],
    email: body("email")
        .trim()
        .notEmpty()
        .normalizeEmail()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
    name: body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),
    password: body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    role: body("role")
        .optional()
        .isIn(["student", "instructor", "admin"])
        .withMessage("Invalid role"),
}

export const validateSignUp = [
  commonValidation.name,
  commonValidation.email,
  commonValidation.password,
  commonValidation.role,
];