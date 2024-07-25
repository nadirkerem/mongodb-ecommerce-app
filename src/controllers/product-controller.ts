import { Request, Response } from 'express';
import Product from '../models/Product';

export async function getProducts(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;
    const sortField = (req.query.sortField as string) || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const validSortFields = [
      'name',
      'price',
      'description',
      'category',
      'userRating',
    ];
    if (!validSortFields.includes(sortField)) {
      res.status(400).json({ message: 'Invalid sort field' });
      return;
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(req.query.sortOrder as string)) {
      res.status(400).json({ message: 'Invalid sort order' });
      return;
    }

    const products = await Product.find()
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip(skip);

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
  const { name, price, description, category } = req.body;

  if (!name || !price || !description || !category) {
    res
      .status(400)
      .json({ message: 'Name, price, description, and category are required' });
    return;
  }

  if (name.length < 3 || name.length > 100) {
    res
      .status(400)
      .json({ message: 'Name must be between 3 and 100 characters long' });
    return;
  }

  if (price < 0) {
    res.status(400).json({ message: 'Price must be a positive number' });
    return;
  }

  if (description.length < 10) {
    res
      .status(400)
      .json({ message: 'Description must be at least 10 characters long' });
    return;
  }

  if (category.length < 3 || category.length > 50) {
    res
      .status(400)
      .json({ message: 'Category must be between 3 and 50 characters long' });
    return;
  }

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
  const { name, price, description, category } = req.body;

  if (!name && !price && !description && !category) {
    res.status(400).json({
      message:
        'At least one of name, price, description, or category is required',
    });
    return;
  }

  if (name && (name.length < 3 || name.length > 100)) {
    res
      .status(400)
      .json({ message: 'Name must be between 3 and 100 characters long' });
    return;
  }

  if (price !== undefined && price < 0) {
    res.status(400).json({ message: 'Price must be a positive number' });
    return;
  }

  if (description && description.length < 10) {
    res
      .status(400)
      .json({ message: 'Description must be at least 10 characters long' });
    return;
  }

  if (category && (category.length < 3 || category.length > 50)) {
    res
      .status(400)
      .json({ message: 'Category must be between 3 and 50 characters long' });
    return;
  }

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
    res.status(500).json({ message: error.message });
  }
}

export async function deleteProduct(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    await product.deleteOne();
    res.status(200).json({ message: 'Product and associated orders deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
