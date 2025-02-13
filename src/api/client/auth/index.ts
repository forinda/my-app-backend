import { di } from '@/common/di';
import { Router } from 'express';
import { LoginUserController } from './controllers/login.controller';
import { GetUserSessionController } from './controllers/session.controller';
import { RegisterUserController } from './controllers/register.controller';
import { UserLogoutController } from './controllers/logout.controller';

type Props = {
  app: Router;
};

export function setupAuthRoutes({ app }: Props) {
  const router = Router();

  router
    .post('/login', di.resolve(LoginUserController).post)
    .post('/session', di.resolve(GetUserSessionController).post)
    .post('/logout', di.resolve(UserLogoutController).post)
    .post('/register', di.resolve(RegisterUserController).post);

  app.use('/auth', router);
}
