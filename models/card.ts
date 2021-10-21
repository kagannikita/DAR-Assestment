import mongoose, { Schema } from 'mongoose';
import ICard from '../interfaces/card';

const CardSchema: Schema = new Schema(
  {
    word: { type: String, required: true },
    translation: { type: String, required: true },
    image: { type: String, required: true },
    audio: { type: String, required: true },
    audio_id: { type: String },
    image_id: { type: String },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model<ICard>('Card', CardSchema);
