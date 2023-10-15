import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT } from "../..";
import { validateLoginInput } from "../../validation/userInput";

//db
const prisma = new PrismaClient();
const router = express.Router();

interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
  role: "USER" | "ADMIN";
}

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

router.get("/user/:id", async (req: Request, res: Response) => {
  //get a specific user
  try {
    const id = parseInt(req.params.id, 10);
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error fetching user", error);
  }
});

router.post("/user", async (req: Request, res: Response) => {
  try {
    //create new user
    const { email, password, name, role }: User = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
        role: role,
      },
    });
    res.status(200).json({ message: "User created" });
  } catch (error) {
    console.error("There was an error creating the user", error);
  }
});

router.put("/user/:id", async (req: Request, res: Response) => {
  //update a user
  try {
    const id = parseInt(req.params.id, 10);
    const { email, password, name, role }: User = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: id },
      data: { email: email, password: hashedPassword, name: name, role: role },
    });
    res.json({ message: `User ${email} updated` });
  } catch (error) {
    console.error("Error updating user", error);
  }
});

router.delete("/user/:id", async (req: Request, res: Response) => {
  //delete a user
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.send({ message: "User deleted" });
  } catch (error) {
    console.error("User not found", error);
  }
});

//register
router.post(
  "/register",
  validateLoginInput,
  async (req: Request, res: Response) => {
    const { email, password }: User = req.body;
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
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
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
    console.error({ message: "Invalid token", error });
  }
};

export default router;
