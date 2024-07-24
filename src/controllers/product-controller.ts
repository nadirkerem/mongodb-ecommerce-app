import { Request, Response } from 'express';
import Product from '../models/Product';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;

    const products = await Product.find().limit(limit).skip(skip);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getProductById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createProduct(
  req: Request,
  res: Response
): Promise<void> {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message, errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
