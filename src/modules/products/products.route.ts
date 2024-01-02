import { Router } from 'express';
import { getAllProducts,createProduct,updateProduct, getSingleProduct ,deleteProduct, addReview, updateReview, deleteReview} from './products.controller';
import userAuthMiddleware from '../../common/middleware/auth/user.auth.middleware'
import adminAuthMiddleware from '../../common/middleware/auth/admin.auth.middleware';

const router = Router();

router.get('/',getAllProducts );
router.post('/', adminAuthMiddleware, createProduct ); 
router.put('/:id',adminAuthMiddleware,updateProduct ); 
router.delete('/:id',adminAuthMiddleware,deleteProduct ); 
router.get('/:id',userAuthMiddleware,getSingleProduct ); 
router.post('/review/:productId',userAuthMiddleware,addReview ); 
router.patch('/review/:productId/update-review/:reviewId',userAuthMiddleware,updateReview ); 
router.delete('/review/:productId/delete-review/:reviewId',userAuthMiddleware,deleteReview ); 

export const productController = router;
