import { Request, Response } from 'express';
import User from '../models/User';

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find();
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
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
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
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message, errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
