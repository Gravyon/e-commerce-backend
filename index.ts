import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user/user.route";
import productRouter from "./routes/product/product.route";
import bodyParser from "body-parser";
import cors from "cors";
//db
const prisma = new PrismaClient();

//server
const app = express();
const port = 3000;

//env
export const JWT = process.env.JWT || "";
if (!JWT) {
  throw new Error("JWT environment variable is not defined.");
}

//middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use("/api", userRouter);
app.use("/api", productRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Api running");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`);
});
