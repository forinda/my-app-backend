// import { Router } from "express";

import { Dependency } from '@/common/di';
import type { ApiReq, ApiRes } from '@/common/http';
import { HttpStatus } from '@/common/http';
import type { Application } from 'express';
import { Router } from 'express';
import { injectable } from 'inversify';

import { apiFunctions } from './client';
type Versions = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ApiVersions = `/api/v${Versions}`;

@injectable()
@Dependency()
export class ApiV1 {
  protected router: Router;
  version: ApiVersions;

  constructor() {
    this.router = Router();
    this.version = '/api/v1';
  }
  healthCheck(req: ApiReq, res: ApiRes) {
    return res.status(HttpStatus.OK).json({
      message: 'API is up and running',
      status: HttpStatus.OK
    });
  }
  setup(app: Application) {
    this.router.get('/', this.healthCheck);

    apiFunctions.forEach((setup) => setup({ app: this.router }));
    app.get('/', this.healthCheck);
    app.use(this.version, this.router);
  }
}
