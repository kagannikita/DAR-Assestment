import { Document } from 'mongoose';

export default interface ICard extends Document {
  word: string;
  translation: string;
  image: string;
  audio: string;
  category: string;
  audio_id: string;
  image_id: string;
}
