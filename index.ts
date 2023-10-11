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
    const { title, description, price } = req.body;

    await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: price,
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

app.get("/products", async (req: Request, res: Response) => {
  //get all products
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products", error);
  }
});

app.get("/product/:id", async (req: Request, res: Response) => {
  //get a specific product
  try {
    const id = parseInt(req.params.id, 10);
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) res.status(404).json({ message: "Product not found" });
  } catch (error) {
    console.error("Error fetching product", error);
  }
});

app.delete("/product/:id", async (req: Request, res: Response) => {
  //delete a product
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    res.send.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Product not found", error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
