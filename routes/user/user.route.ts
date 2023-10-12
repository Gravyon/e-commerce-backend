import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "bun";

//db
const prisma = new PrismaClient();
const router = express.Router();

//env
const JWT = env.JWT;
//users
router.get("/user", async (req: Request, res: Response) => {
  try {
    //get users
    const users = prisma.user.findMany();
    res.json({ message: users });
  } catch (error) {
    console.error("Error gettings users", error);
  }
});

// Validate user input
const validateLoginInput = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

//register
router.post(
  "/register",
  validateLoginInput,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
        },
      });
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Registration failed", error });
    }
  }
);

// Login
router.post(
  "/login",
  validateLoginInput,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate and sign a JWT token
      const token = jwt.sign({ userId: user.id }, JWT, {
        expiresIn: "24h", // Token expiration time
      });

      res.json({ token });
    } catch (error) {
      console.error({ message: "Login error", error });
    }
  }
);

// router.post("/login", async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const user = await prisma.user.findUnique({ where: { email: email } });

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   const passwordMatch = await bcrypt.compare(password, user.password);
//   if (!passwordMatch) {
//     return res.status(401).json({ message: "Invalid credentials" });
//   }

//   // User is authenticated
//   const token = jwt.sign({ id: user.id }, "JWT", {
//     expiresIn: "24h",
//   });
//   res.status(200).json({ message: "Login successful", token });
// });

export default router;