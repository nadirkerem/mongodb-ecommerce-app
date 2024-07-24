import { Request, Response } from 'express';
import Restaurant from '../models/Restaurant';
import mongoose from 'mongoose';

export async function getRestaurants(req: Request, res: Response) {
  try {
    const restaurants = await Restaurant.find()
      .populate('cuisine')
      .populate('borough')
      .limit(25);

    res.status(200).json(restaurants);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getRestaurantById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('cuisine')
      .populate('borough');

    if (!restaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
    } else {
      res.status(200).json(restaurant);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function createRestaurant(
  req: Request,
  res: Response
): Promise<void> {
  const restaurant = new Restaurant(req.body);
  try {
    const newRestaurant = await restaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message, errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function updateRestaurant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRestaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
    } else {
      res.status(200).json(updatedRestaurant);
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message, errors: error.errors });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
}

export async function deleteRestaurant(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!deletedRestaurant) {
      res.status(404).json({ message: 'Restaurant not found' });
    } else {
      res.status(200).json({ message: 'Restaurant deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
