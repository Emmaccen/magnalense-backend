import { NextFunction, Request, Response } from 'express';
import { HttpResponseCodes } from '../../enums/HttpResponseCodes';

function attachResponder(req: Request, res: Response, next: NextFunction) {
  res.success = function (message = 'Successful', data = null) {
    return res.json({
      message,
      data,
      status: HttpResponseCodes.OK,
      success: true,
    });
  };

  res.badRequest = function (message = 'Bad request', errors = null) {
    return res.status(HttpResponseCodes.BAD_REQUEST).json({
      message,
      errors,
      status: HttpResponseCodes.BAD_REQUEST,
      success: false,
    });
  };

  res.notFound = function (message = 'Not found', errors = null) {
    return res.status(HttpResponseCodes.NOT_FOUND).json({
      message,
      errors,
      status: HttpResponseCodes.NOT_FOUND,
      success: false,
    });
  };

  res.internalServer = function (
    message = 'Internal server error',
    errors = null
  ) {
    return res.status(HttpResponseCodes.INTERNAL_SERVER_ERROR).json({
      message,
      errors,
      status: HttpResponseCodes.INTERNAL_SERVER_ERROR,
      success: false,
    });
  };

  next();
}

export default attachResponder;
