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
import { SwaggerSetup } from '@/common/swagger/setup';
@dependency()
export class ApiServer {
  app: Application;
  _name: string;

  @inject(ApiServerSetup) private readonly apiServerSetup: ApiServerSetup;
  @inject(ApiErrorRouteHandler)
  private readonly apiErrorRouteHandler: ApiErrorRouteHandler;
  @inject(Logger) private readonly logger: Logger;
  @inject(SwaggerSetup) private readonly swaggerSetup: SwaggerSetup;

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
    const port = this.config.conf.PORT;
    const listeningMessage = `Listening on http://localhost:${port}`;
    const message = `(API):${listeningMessage} ${this.config.conf.NODE_ENV === 'development' ? '🚀' : '🔒'}`;

    this.logger.info(message);

    // Log Swagger documentation paths
    this.logger.info('📚 API Documentation available at:');
    this.logger.info(`   - Swagger UI: http://localhost:${port}/api-docs`);
    this.logger.info(
      `   - Swagger JSON: http://localhost:${port}/swagger.json`
    );
  }

  public run() {
    const server = createServer(this.bootstrap());

    this.socketHandler.setup(server);
    server.listen(this.config.conf.PORT, this.onListening);
  }
}
