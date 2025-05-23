import { di } from '@/common/di';
import { Router } from 'express';
import { CreateOrganizationDesignationController } from './controllers/create.controller';
import { FetchOrganizationDesignationController } from './controllers/fetch.controller';
import { UpdateOrganizationDesignationController } from './controllers/update.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupOrganizationDesignationsRoutes: RouteSetupFunction = ({
  app
}) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchOrganizationDesignationController).get)
    .post('/', di.resolve(CreateOrganizationDesignationController).post)
    .put('/:id', di.resolve(UpdateOrganizationDesignationController).put);

  app.use('/organization-designations', router);
};
