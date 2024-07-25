import mongoose, { Schema, Document } from 'mongoose';

import Order from './Order';

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  userRating?: number;
}

const productSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [3, 'Product name must be at least 3 characters long'],
    maxlength: [100, 'Product name must be at most 100 characters long'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    minlength: [3, 'Category must be at least 3 characters long'],
    maxlength: [50, 'Category must be at most 50 characters long'],
  },
  userRating: {
    type: Number,
    min: [0, 'Rating must be between 0 and 5'],
    max: [5, 'Rating must be between 0 and 5'],
    index: true,
  },
});

productSchema.pre<IProduct>(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      await Order.deleteMany({ 'products.product': this._id });
      next();
    } catch (error: any) {
      next(error);
    }
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
