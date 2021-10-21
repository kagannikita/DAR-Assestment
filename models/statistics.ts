import mongoose, { Schema } from 'mongoose';
import IStatistics from '../interfaces/statistics';

const StatisticsSchema: Schema = new Schema(
  {
    correct: { type: Number, required: false },
    clicks: { type: Number, required: false },
    wrong: { type: Number, required: false },
    card: { type: Schema.Types.ObjectId, ref: 'Card', required: false },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model<IStatistics>('Statistics', StatisticsSchema);
