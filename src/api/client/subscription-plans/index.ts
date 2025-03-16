import { di } from '@/common/di';
import { Router } from 'express';
import { FetchSubscriptionPlansController } from './controllers/fetch.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupSubscriptionPlansRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router.get('/', di.resolve(FetchSubscriptionPlansController).get);

  app.use('/subscription-plans', router);
};
