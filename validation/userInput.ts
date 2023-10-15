import { body } from "express-validator";

// Validate user input
export const validateLoginInput = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];
