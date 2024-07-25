import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

export async function getOrders(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;
    const sortField = (req.query.sortField as string) || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const validSortFields = ['createdAt', 'totalAmount', 'status'];
    if (!validSortFields.includes(sortField)) {
      res.status(400).json({ message: 'Invalid sort field' });
      return;
    }

    const validSortOrders = ['asc', 'desc'];
    if (!validSortOrders.includes(req.query.sortOrder as string)) {
      res.status(400).json({ message: 'Invalid sort order' });
      return;
    }

    const orders = await Order.find()
      .populate('user')
      .populate('products.product')
      .sort({ createdAt: sortOrder })
      .limit(limit)
      .skip(skip);

    if (orders.length === 0) {
      res.status(404).json({ message: 'No orders found' });
    } else {
      res.status(200).json(orders);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('products.product');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(200).json(order);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  const { user, products, totalAmount, status } = req.body;

  if (!user || !products || !totalAmount || !status) {
    res.status(400).json({
      message: 'User, products, totalAmount, and status are required',
    });
    return;
  }

  try {
    const userExists = await User.findById(user);
    if (!userExists) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    for (const item of products) {
      const productExists = await Product.findById(item.product);
      if (!productExists) {
        res
          .status(400)
          .json({ message: `Invalid product ID: ${item.product}` });
        return;
      }
    }

    const order = new Order(req.body);
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
  const { user, products, totalAmount, status } = req.body;

  if (!user && !products && !totalAmount && !status) {
    res.status(400).json({
      message:
        'At least one of user, products, totalAmount, or status is required',
    });
    return;
  }

  try {
    if (user) {
      const userExists = await User.findById(user);
      if (!userExists) {
        res.status(400).json({ message: 'Invalid user ID' });
        return;
      }
    }

    // Check if the products exist
    if (products && products.length > 0) {
      for (const item of products) {
        const productExists = await Product.findById(item.product);
        if (!productExists) {
          res
            .status(400)
            .json({ message: `Invalid product ID: ${item.product}` });
          return;
        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(200).json(updatedOrder);
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message, errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(200).json({ message: 'Order deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOrdersByUserId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const userExists = await User.findById(req.params.userId);
    if (!userExists) {
      res.status(400).json({ message: 'Invalid user ID' });
      return;
    }

    const orders = await Order.find({ user: req.params.userId })
      .populate('user')
      .populate('products.product');
    if (orders.length === 0) {
      res.status(404).json({ message: 'No orders found for this user' });
    } else {
      res.status(200).json(orders);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getOrdersByProductId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const productExists = await Product.findById(req.params.productId);
    if (!productExists) {
      res.status(400).json({ message: 'Invalid product ID' });
      return;
    }

    const orders = await Order.find({
      'products.product': req.params.productId,
    })
      .populate('user')
      .populate('products.product');
    if (orders.length === 0) {
      res.status(404).json({ message: 'No orders found for this product' });
    } else {
      res.status(200).json(orders);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
