import mongoose, { Schema, Document } from 'mongoose';

interface IBorough extends Document {
  name: string;
}

const boroughSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Borough = mongoose.model<IBorough>('Borough', boroughSchema);

export default Borough;
