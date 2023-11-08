import { Router } from 'express';
import { healthCheckHandler } from './health.service';

const router = Router();

router.get('/', healthCheckHandler);

export const healthController = router;
