import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Product from '../src/models/Product';
import Order from '../src/models/Order';
import users from '../src/data/users.json';
import products from '../src/data/products.json';
import orders from '../src/data/orders.json';

dotenv.config();

const populateData = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing in env');
    }

    const options = {
      dbName: 'sample_ecommerce',
    };

    await mongoose.connect(MONGO_URI, options);
    console.log('Connected to the database.');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    await User.insertMany(users);
    await Product.insertMany(products);

    const userDocs = await User.find();
    const productDocs = await Product.find();

    const ordersWithRefs = orders.map((order) => ({
      ...order,
      user: userDocs[Math.floor(Math.random() * userDocs.length)]._id,
      products: order.products.map((p) => ({
        ...p,
        product:
          productDocs[Math.floor(Math.random() * productDocs.length)]._id,
      })),
    }));

    await Order.insertMany(ordersWithRefs);

    console.log('Data populated successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

populateData();
