import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//db
const prisma = new PrismaClient();

//server
const app = express();
const port = 8080;
app.use(express.json());

app.post("/product", async (req: Request, res: Response) => {
  try {
    //create new product
    const { title, description } = req.body;

    await prisma.post.create({
      data: {
        title: title,
        description: description,
      },
    });
    res.status(200).json({ message: "Product created" });
  } catch (error) {
    console.error("There was an error creating the product", error);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Api running");
});

app.get("/products", (req: Request, res: Response) => {
  //get all products
});

app.get("/product/:id", (req: Request, res: Response) => {
  //get a specific product
});

app.delete("/product/:id", (req: Request, res: Response) => {
  //delete a product
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
