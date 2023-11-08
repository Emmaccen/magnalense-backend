import { Express } from 'express';
import { attachResponder } from './common/middleware';
import { healthController } from './modules/health/health.controller';
import { userController } from './modules/user/user.controller';

export default function (app: Express): void {
  app.use(attachResponder);

  app.use('/health', healthController);

  app.use('/user', userController);
}
