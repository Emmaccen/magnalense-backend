import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        name: string;
        role: string;
      };
    }
    interface Response {
      success: (message?: string, data?: any) => {};
      badRequest: (message?: string, errors?: any) => {};
      notFound: (message?: string, errors?: any) => {};
      internalServer: (message?: string, errors?: any) => {};
    }
  }
}
