import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
interface Product {
  title: string;
  description: string;
  price: number;
}
//products
router.post("/product", async (req: Request, res: Response) => {
  try {
    //create new product
    const { title, description, price }: Product = req.body;
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

router.get("/products", async (req: Request, res: Response) => {
  //get all products
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products", error);
  }
});

router.get("/product/:id", async (req: Request, res: Response) => {
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

router.put("/product/:id", async (req: Request, res: Response) => {
  //update a product
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, price }: Product = req.body;
    await prisma.product.update({
      where: { id: id },
      data: { title: title, description: description, price: price },
    });
    res.json({ message: `Product ${title} updated` });
  } catch (error) {
    console.error("Error updating product", error);
  }
});

router.delete("/product/:id", async (req: Request, res: Response) => {
  //delete a product
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.product.delete({
      where: {
        id: id,
      },
    });
    res.send({ message: "Product deleted" });
  } catch (error) {
    console.error("Product not found", error);
  }
});

export default router;
