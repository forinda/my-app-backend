import { Dependency } from '@/common/di';
import type { createServer as createHttpServer } from 'http';
import type { createServer as createHttpsServer } from 'https';
import { injectable } from 'inversify';
import type { Namespace, Socket } from 'socket.io';
import { Server } from 'socket.io';
import chalk from 'chalk';

export type ServerType =
  | ReturnType<typeof createHttpServer>
  | ReturnType<typeof createHttpsServer>;

const onlineMembers = new Map<string, Set<string>>();

@injectable()
@Dependency()
export class SocketHandler {
  public readonly socketChatNamespace = new RegExp(
    /^\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

  private setupServer(httpServer: ServerType) {
    return new Server(httpServer, {
      cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
      }
    });
  }
  private emitOnlineMembers(roomId: string, socket: Socket) {
    const members = onlineMembers.get(roomId);

    if (members) {
      socket.to(roomId).emit('online-members', Array.from(members));
      socket.emit('online-members', Array.from(members));
    }
  }

  public setup(httpServer: ServerType) {
    const io = this.setupServer(httpServer);
    const namespace = io.of(this.socketChatNamespace);

    console.info(chalk.yellow(`[Sockets] - Setting up namespaces`));
    this.setupCallback(namespace);
    console.info(chalk.green(`[Sockets] - Namespaces setup complete`));
  }

  private socketHandler(socket: Socket) {
    console.info(`SID:${socket.id} - A user connected to ${socket.nsp.name}`);

    socket.on('join-room', (roomId: string, userId: string) => {
      if (!roomId || !userId) {
        console.error('Invalid roomId or userId');

        return;
      }
      socket.join(roomId);
      if (!onlineMembers.has(roomId)) {
        onlineMembers.set(roomId, new Set());
      }
      onlineMembers.get(roomId)!.add(userId);
      socket.to(roomId).emit('user-joined', userId);
      this.emitOnlineMembers(roomId, socket);
    });
    socket.on('disconnect', () => {
      console.info(`SID:${socket.id} - A user disconnected`);
      socket.rooms.forEach((room) => {
        const members = onlineMembers.get(room);

        if (members) {
          members.delete(socket.id);
          if (members.size === 0) {
            onlineMembers.delete(room);
          }
          socket.to(room).emit('user-left', socket.id);
          this.emitOnlineMembers(room, socket);
        }
        socket.leave(room);
      });
    });
  }

  private setupCallback(ns: Namespace) {
    ns.on('connection', this.socketHandler);
  }
}
