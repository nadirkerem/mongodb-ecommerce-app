import { Request, Response } from 'express';
import User from '../models/User';
import validator from 'validator';

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;

    const users = await User.find().skip(skip).limit(limit);
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email, and password are required' });
    return;
  }

  if (name.length < 3 || name.length > 50) {
    res
      .status(400)
      .json({ message: 'Name must be between 3 and 50 characters long' });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: 'Password must be at least 6 characters long' });
    return;
  }

  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  // Validate request body
  if (!name && !email && !password) {
    res.status(400).json({
      message: 'At least one of name, email, or password is required',
    });
    return;
  }

  if (name && (name.length < 3 || name.length > 50)) {
    res
      .status(400)
      .json({ message: 'Name must be between 3 and 50 characters long' });
    return;
  }

  if (email && !validator.isEmail(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  if (password && password.length < 6) {
    res
      .status(400)
      .json({ message: 'Password must be at least 6 characters long' });
    return;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    await user.deleteOne();
    res.status(200).json({ message: 'User and associated orders deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
