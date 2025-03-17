import { ApiServerSetup } from '@/app';
import { Config } from '@/common/config';
import { dependency } from '@/common/di';
import { ApiErrorRouteHandler } from '@/common/errors/route-err-handler';
import type { Application } from 'express';
import express from 'express';
import { createServer } from 'http';
import { inject } from 'inversify';
import { SocketHandler } from './socket-server';
import { Logger } from '@/common/logger';
// import { baseLogger } from '@/common/logger';
@dependency()
export class ApiServer {
  app: Application;
  _name: string;

  @inject(ApiServerSetup) private readonly apiServerSetup: ApiServerSetup;
  @inject(ApiErrorRouteHandler)
  private readonly apiErrorRouteHandler: ApiErrorRouteHandler;
  @inject(Logger) private readonly logger: Logger;

  @inject(Config) private readonly config: Config;
  @inject(SocketHandler) private readonly socketHandler: SocketHandler;

  constructor() {
    this.app = express();
    this._name = 'ApiServer';
  }

  set name(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  bootstrap(name: string = 'default') {
    this._name = name;
    this.apiServerSetup.setupExpressApp(this.app);
    this.apiErrorRouteHandler.plugin({ app: this.app });

    return this.app;
  }

  private onListening() {
    // console.log({ config: this.config });
    const listeningMessage = `Listening on http://localhost:${this.config.conf.PORT}`;

    const message = `(API):${listeningMessage} ${this.config.conf.NODE_ENV === 'development' ? '🚀' : '🔒'}`;

    this.logger.info(message);
  }

  public run() {
    const server = createServer(this.bootstrap());

    this.socketHandler.setup(server);
    server.listen(this.config.conf.PORT, this.onListening);
  }
}
