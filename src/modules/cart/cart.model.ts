import { Document, Schema, model, Types } from 'mongoose';

interface ProductItem {
  product: Types.ObjectId;
  price: number;
  quantity: number;
}

interface CartDocument extends Document {
  user: Types.ObjectId;
  items: ProductItem[];
  total: number;
}

const cartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        price: Number,
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    total: Number,
  },
  {
    timestamps: true,
  }
);

const Cart = model<CartDocument>('Cart', cartSchema);

export default Cart;