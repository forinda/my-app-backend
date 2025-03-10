import { di } from '@/common/di';
import { Router } from 'express';
import { FetchOrganizationMembersController } from './controllers/fetch-members.controller';
import { RemoveOrganizationMembersController } from './controllers/remove-member.controller';
import { AddOrganizationMemberController } from './controllers/add-member.controller';
import { FetchOrganizationMemberInvitesController } from './controllers/fetch-invites.controller';
import { RespondToOrgInviteController } from './controllers/respond-to-invite.controller';
import { InitOrgMemberProfileController } from './controllers/init-member-profile.controller';
import { UpdateOrgPersonalProfileController } from './controllers/update-personal-org-profile.controller';
import type { RouteSetupFunction } from '@/common/interfaces/controller';

export const setupOrganizationMemberRoutes: RouteSetupFunction = ({ app }) => {
  const router = Router();

  router
    .get('/', di.resolve(FetchOrganizationMembersController).get)
    .post('/add', di.resolve(AddOrganizationMemberController).post)
    .post('/remove', di.resolve(RemoveOrganizationMembersController).post)
    .get('/invites', di.resolve(FetchOrganizationMemberInvitesController).get)
    .post('/respond/:id', di.resolve(RespondToOrgInviteController).post)
    .post('/init-profile/:id', di.resolve(InitOrgMemberProfileController).post)
    .put('/update-profile', di.resolve(UpdateOrgPersonalProfileController).put);

  app.use('/organization-members', router);
};
