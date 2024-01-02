import { Request, Response, NextFunction } from 'express';

import { HttpResponseCodes } from '../../enums/HttpResponseCodes';
import CustomError from '../errors/custom-error';

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = error.statusCode || HttpResponseCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Something went wrong, try again later';

  if (error instanceof CustomError) {
    res.status(statusCode).json({ msg: message });
  } else {
    res.status(statusCode).json({ msg: message });
  }
};

export default errorHandler;
