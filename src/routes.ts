import { Express } from 'express';
import { attachResponder } from './common/middleware';
import { userController } from './modules/user/user.controller';

export default function (app: Express): void {
  app.use(attachResponder);

  app.use('/user', userController);
}
