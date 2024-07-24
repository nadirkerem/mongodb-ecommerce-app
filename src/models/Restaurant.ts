import mongoose, { Schema, Document } from 'mongoose';

interface IGrade extends Document {
  date: Date;
  grade: string;
  score: number;
}

interface IRestaurant extends Document {
  address: {
    building: string;
    coord: [number, number];
    street: string;
    zipcode: string;
  };
  borough: mongoose.Schema.Types.ObjectId;
  cuisine: mongoose.Schema.Types.ObjectId;
  grades: IGrade[];
  name: string;
  restaurant_id: string;
}

const gradeSchema: Schema = new Schema({
  date: { type: Date, required: true },
  grade: { type: String, required: true },
  score: { type: Number, required: true },
});

const restaurantSchema: Schema = new Schema({
  address: {
    building: { type: String, required: true },
    coord: { type: [Number], required: true },
    street: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  borough: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borough',
    required: true,
  },
  cuisine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cuisine',
    required: true,
  },
  grades: { type: [gradeSchema], required: true },
  name: { type: String, required: true },
  restaurant_id: { type: String, required: true },
});

const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);

export default Restaurant;
