import { Document } from 'mongoose';

export default interface IStatistics extends Document {
  clicks: number;
  correct: number;
  wrong: number;
  card: string;
}
