import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//db
const prisma = new PrismaClient();
const router = express.Router();

//env
const JWT = process.env.JWT || "";

interface User {
  id: number;
  email: string;
  password: string;
}

type UserRole = "admin" | "user";

//verify user token

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const user = jwt.verify(token, JWT) as User;
    req.body = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};

//users
router.get("/user", async (req: Request, res: Response) => {
  try {
    //get users
    const users: User[] = await prisma.user.findMany();
    res.json({ message: users });
  } catch (error) {
    console.error("Error getting users", error);
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
      const user: User = await prisma.user.create({
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
      const user: User | null = await prisma.user.findUnique({
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
      const token = jwt.sign({ user: user }, JWT, { expiresIn: "24h" });

      res.json({ token });
    } catch (error) {
      console.error({ message: "Login error", error });
    }
  }
);

export default router;
