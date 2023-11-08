import { Request, Response } from 'express';

export async function healthCheckHandler(req: Request, res: Response) {
  res.success('OK');
}
