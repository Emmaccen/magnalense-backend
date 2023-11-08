import mongoose from 'mongoose';
import log from '../logger';
import { configService } from '../service/config.service';

export function connect(): Promise<void> {
  const dbUrl = configService('dbUrl');

  return mongoose
    .connect(dbUrl as string)
    .then(() => {
      log.info('Database connected.');
    })
    .catch((error) => {
      log.error('Db error.', error);
      throw error;
    });
}
