import { HydratedDocument, Model, Schema, Types, model } from 'mongoose';
import { ProductDocument } from './products.types';

export interface ReviewDocument {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

export const ReviewModel: Model<ReviewDocument> = model<ReviewDocument>('Review', ReviewSchema);

 

const PrescriptionSchema = new Schema({
  leftEye: {
    type: Number,
    required: true,
    default: 0.0,
  },
  rightEye: {
    type: Number,
    required: true,
    default: 0.0,
  },
});

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    otherImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    prescription: [PrescriptionSchema],
    quantity: {
      type: String,
    },
    category: {
      type: String,
      enum: [
        'Medicated Glasses',
        'Sunglasses',
        'Reading Glasses',
        'OtherCategory',
      ],
      default: 'Medicated Glasses',
    },
    frameMaterial: {
      type: String,
      enum: ['Metal', 'Plastic', 'Wood', 'OtherFrameMaterial'],
      default: 'Plastic',
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Silver', 'OtherColor'],
      default: 'Black',
    },
    lensMaterial: {
      type: String,
      enum: ['Polycarbonate', 'Glass', 'OtherLensMaterial'],
      default: 'Glass',
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviews: [ReviewSchema],
  },
  { timestamps: true }
);

const Product = model<ProductDocument>('Product', ProductSchema);

export default Product;
