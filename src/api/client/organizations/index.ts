import { di } from '@/common/di';
import { Router } from 'express';
import { CreateOrganizationController } from './controllers/create-organization.controller';
import { FetchOrganizationsController } from './controllers/get-organizations.controller';
import { UpdateOrganizationController } from './controllers/update-organization.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';
import { FetchOrganizationByIdController } from './controllers/fetch-by-id.controller';
import { FetchOrganizationInvitesController } from './controllers/fetch-invites.controller';

export const setupOrganizationRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchOrganizationsController).get)
    .get('/invites', di.resolve(FetchOrganizationInvitesController).get)
    .get('/:id', di.resolve(FetchOrganizationByIdController).get)
    .post('/', di.resolve(CreateOrganizationController).post)
    .put('/', di.resolve(UpdateOrganizationController).post);

  app.use('/organizations', router);
};
