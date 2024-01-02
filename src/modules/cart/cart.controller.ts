import { Request, Response } from 'express';
import Cart from '../cart/cart.model';
import Products from '../products/products.model'; 
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';
import { Types } from 'mongoose';


const calculateCartTotal = (items: any[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const viewUserCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(HttpResponseCodes.BAD_REQUEST).json('User ID is required');
      return;
    }

    const viewCart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: '-reviews',
    });
console.log(viewCart?.items)
    if (!viewCart) {
      res.status(HttpResponseCodes.OK).send('User cart is empty.');
    } else {
      res.status(HttpResponseCodes.OK).json({
        'Number of Items in Cart': viewCart.items.length,
        viewCart,
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};


export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(HttpResponseCodes.BAD_REQUEST).json('User ID is required');
      return;
    }

    const product = await Products.findById(productId);

    if (!product) {
      res.status(HttpResponseCodes.NOT_FOUND).json({
        message: 'Product not found',
        error: 'Product not found',
      });
      return;
    }

    const productObjectId = new Types.ObjectId(productId);

    let userCart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: '-reviews',
    });

    if (!userCart) {
      userCart = new Cart({
        user: userId,
        items: [],
        total: 0,
      });
    }

    const cartItemIndex = userCart.items.findIndex(
      (item) => item.product._id.toString() === productId,
    );

    if (cartItemIndex !== -1) {
      userCart.items[cartItemIndex].quantity += 1;
    } else {
      userCart.items.push({
        product: productObjectId,
        price: product.price,
        quantity: 1,
      });
    }
    userCart.total = calculateCartTotal(userCart.items);

    await userCart.save();

    res.status(HttpResponseCodes.CREATED).json({"msg":"Item added successfully",userCart});
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};


export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const {  productId } = req.params;

    let userCart =  await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      select: '-reviews',
    });

    if (!userCart) {
        res.status(HttpResponseCodes.NOT_FOUND).json({ error: 'Cart not found' });
        return;
    }
    
    const cartItemIndex = userCart.items.findIndex(
      (item) => item.product._id.toString() === productId,
    );
    console.log(cartItemIndex)
    if (cartItemIndex === -1) {
      res.status(HttpResponseCodes.NOT_FOUND).json({ error: 'Product not found in the cart' });
      return 
    }

    userCart.items.splice(cartItemIndex, 1);

    userCart.total = calculateCartTotal(userCart.items);

    await userCart.save();

    res.status(HttpResponseCodes.OK).json({"msg":"Item removed successfully",userCart});
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};


export const IncreaseQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    if (!userId) {
      res.status(HttpResponseCodes.UNAUTHORIZED).json({ error: 'User not authenticated' });
      return;
    }


    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      res.status(HttpResponseCodes.NOT_FOUND).json({ error: 'Cart not found' });
      return;
    }

    const cartItem = userCart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      res.status(HttpResponseCodes.NOT_FOUND).json({ error: 'Product not found in the cart' });
      return;
    }

    cartItem.quantity += 1;

    userCart.total = calculateCartTotal(userCart.items);

    await userCart.save();

    res.status(HttpResponseCodes.OK).json(userCart);
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

export const decreaseQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId } = req.params;

    if (!userId) {
      res.status(HttpResponseCodes.UNAUTHORIZED).json({ error: 'User not authenticated' });
      return;
    }

    let userCart = await Cart.findOne({ user: userId });

    if (!userCart) {
      res.status(HttpResponseCodes.NOT_FOUND).json({ error: 'Cart not found' });
      return;
    }

    const cartItem = userCart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!cartItem) {
      res.status(HttpResponseCodes.NOT_FOUND).json({ error: 'Product not found in the cart' });
      return;
    }

    cartItem.quantity -= 1;

    userCart.total = calculateCartTotal(userCart.items);
    await userCart.save();

    res.status(HttpResponseCodes.OK).json(userCart);
  } catch (error: any) {
    console.error(error.message);
    res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
};

 


