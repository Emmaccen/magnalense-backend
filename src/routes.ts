import { Express } from 'express';
import { attachResponder } from './common/middleware';
import { healthController } from './modules/health/health.controller';
import { adminController } from './modules/Admin/admin.route';
import { userController } from './modules/user/user.route';
import { productController } from './modules/products/products.route';
import { cartController } from './modules/cart/cart.route';

export default function (app: Express): void {
  app.use(attachResponder);

  app.use('/health', healthController);//???
  app.use('/user', userController);
  app.use('/admin', adminController);
  app.use('/cart', cartController);
  app.use('/products', productController);
}
