import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';

import Order from './Order';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [50, 'Name must be at most 50 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
});

userSchema.pre<IUser>(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      await Order.deleteMany({ user: this._id });
      next();
    } catch (error: any) {
      next(error);
    }
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
