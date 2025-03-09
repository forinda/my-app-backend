import { Dependency } from '@/common/di';
import type { createServer as createHttpServer } from 'http';
import type { createServer as createHttpsServer } from 'https';
import { injectable } from 'inversify';
import type { Namespace } from 'socket.io';
import { Server } from 'socket.io';
import chalk from 'chalk';
export type ServerType =
  | ReturnType<typeof createHttpServer>
  | ReturnType<typeof createHttpsServer>;

@injectable()
@Dependency()
export class SocketHandler {
  // UUID v4 regex which must start with a forward slash
  public readonly socketChatNamespace = new RegExp(
    /^\/[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[4][a-zA-Z0-9]{3}-[89AB][a-zA-Z0-9]{3}-[a-zA-Z0-9]{12}$/i
  );
  private setupServer(httpServer: ServerType) {
    return new Server(httpServer, {
      cors: {
        origin: '*'
      }
    });
  }

  public setup(httpServer: ServerType) {
    const io = this.setupServer(httpServer);
    // Example - /^\/[a-zA-Z0-9]{8}$/ but for UUID v4
    const namespace = io.of(this.socketChatNamespace);

    console.log(chalk.yellow(`[Sockets] - Setting up namespaces`));

    this.setupCallback(namespace);
    console.log(chalk.green(`[Sockets] - Namespaces setup complete`));
  }

  private setupCallback(ns: Namespace) {
    ns.on('connection', (socket) => {
      console.log(`SID:${socket.id} - A user connected to ${socket.nsp.name}`);
      console.log('A user connected');
      socket.on('join-room', (roomId, userId) => {
        console.log(`SID:${socket.id} - A user joined room ${roomId}`);
        socket.join(roomId);
        socket.to(roomId).emit('user-joined', userId);
      });
      socket.on('disconnect', () => {
        // console.log('A user disconnected');
        console.log(`SID:${socket.id} - A user disconnected`);
        socket.rooms.forEach((room) => {
          socket.to(room).emit('user-left', socket.id);
          socket.leave(room);
        });
      });
    });
  }
}
