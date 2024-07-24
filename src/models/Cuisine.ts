import mongoose, { Schema, Document } from 'mongoose';

interface ICuisine extends Document {
  name: string;
}

const cuisineSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Cuisine = mongoose.model<ICuisine>('Cuisine', cuisineSchema);

export default Cuisine;
