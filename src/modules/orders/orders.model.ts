import { Schema, model, Document, Types } from 'mongoose';

interface OrderProduct {
  _id: Types.ObjectId;
  quantity: number;
}

interface OrderDocument extends Document {
  userId: Types.ObjectId;
  products: OrderProduct[];
  quantity?: number;
  price: number;
  location?: string;
  status: 'Pending' | 'On-Delivery' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<OrderDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'On-Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
);

const Orders = model<OrderDocument>('orders', orderSchema);

export default Orders;
