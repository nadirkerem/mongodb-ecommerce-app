import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  products: { product: mongoose.Schema.Types.ObjectId; quantity: number }[];
  totalAmount: number;
  createdAt: Date;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

const orderSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
