import { Router } from 'express';
import userAuthMiddleware from '../../common/middleware/auth/user.auth.middleware';
import { IncreaseQuantity, addToCart, decreaseQuantity, removeCartItem, viewUserCart } from './cart.controller';

const router = Router();


router.get('/',userAuthMiddleware, viewUserCart);
router.post('/:productId',userAuthMiddleware, addToCart);
router.delete('/:productId',userAuthMiddleware, removeCartItem);
router.patch("/increase/:productId",userAuthMiddleware, IncreaseQuantity);
router.patch("/decrease/:productId",userAuthMiddleware, decreaseQuantity);

export const cartController = router;
