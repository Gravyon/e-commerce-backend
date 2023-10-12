import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user/user.route";
import productRouter from "./routes/product/product.route";
//db
const prisma = new PrismaClient();

//server
const app = express();
const port = 3000;
app.use(express.json());

//routes
app.use(userRouter);
app.use(productRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Api running");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});
