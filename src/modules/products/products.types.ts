import { Document, Schema, Types } from 'mongoose';
import { ReviewDocument } from './products.model';

interface Prescription {
  leftEye: number;
  rightEye: number;
}

export interface ProductDocument extends Document {
  title: string;
  price: number;
  image?: string;
  otherImages?: string[];
  description?: string;
  prescription?: Prescription[];
  quantity?: string;
  category: 'Medicated Glasses' | 'Sunglasses' | 'Reading Glasses' | 'OtherCategory';
  frameMaterial: 'Metal' | 'Plastic' | 'Wood' | 'OtherFrameMaterial';
  color: 'Black' | 'Brown' | 'Silver' | 'OtherColor';
  lensMaterial: 'Polycarbonate' | 'Glass' | 'OtherLensMaterial';
  averageRating?: number;
  totalRatings?: number;
  reviews?: ReviewDocument[];
  createdAt?: Date;
  updatedAt?: Date;
}

