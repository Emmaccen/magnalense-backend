import { NextFunction, Request, Response } from 'express';

import { z } from 'zod';
import log from '../logger';

const validate =
  (schema: z.AnyZodObject, type: 'body' | 'query' | 'params') =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse(req[type]);

      return next();
    } catch (e: any) {
      log.error(e.message);
      return res.badRequest(JSON.parse(e.message));
    }
  };

export default validate;
