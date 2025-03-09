import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from 'socket.io';
import { SocketHandler } from './socket-server';
import type { ServerType } from './socket-server';
import { createServer as createHttpServer } from 'http';

// Mock the socket.io module
vi.mock('socket.io', () => {
  const mSocket = {
    on: vi.fn(),
    join: vi.fn(),
    to: vi.fn().mockReturnThis(),
    emit: vi.fn(),
    leave: vi.fn(),
    id: 'socket-id',
    nsp: { name: '/namespace' },
    rooms: new Set(['room1', 'room2'])
  };
  const mNamespace = {
    on: vi.fn()
  };
  const mServer = {
    of: vi.fn().mockReturnValue(mNamespace)
  };

  return { Server: vi.fn(() => mServer) };
});

describe('SocketHandler', () => {
  let socketHandler: SocketHandler;
  let httpServer: ServerType;

  beforeEach(() => {
    socketHandler = new SocketHandler();
    httpServer = createHttpServer();
  });

  it('should setup server with CORS enabled', () => {
    const io = socketHandler['setupServer'](httpServer);

    expect(io).toBeInstanceOf(Server);
    expect(Server).toHaveBeenCalledWith(httpServer, {
      cors: {
        origin: '*'
      }
    });
  });

  it('should setup namespaces and callbacks', () => {
    const io = socketHandler['setupServer'](httpServer);

    socketHandler.setup(httpServer);
    expect(io.of).toHaveBeenCalledWith(socketHandler['socketChatNamespace']);
    const namespace = io.of(socketHandler['socketChatNamespace']);

    expect(namespace.on).toHaveBeenCalledWith(
      'connection',
      expect.any(Function)
    );
  });

  it('should handle socket connection and events', () => {
    const io = socketHandler['setupServer'](httpServer);

    socketHandler.setup(httpServer);
    const namespace = io.of(socketHandler['socketChatNamespace']);

    // Extract the connection callback from the mock
    const connectionCallback = vi.mocked(namespace.on).mock.calls[0][1];

    // Mock socket object
    const socket = {
      on: vi.fn(),
      join: vi.fn(),
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
      leave: vi.fn(),
      id: 'socket-id',
      nsp: { name: '/namespace' },
      rooms: new Set(['room1', 'room2'])
    };

    // Simulate the 'connection' event
    connectionCallback(socket);

    // Verify 'join-room' and 'disconnect' event handlers are set up
    expect(socket.on).toHaveBeenCalledWith('join-room', expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));

    // Simulate the 'join-room' event
    const joinRoomCallback = vi.mocked(socket.on).mock.calls[0][1];

    joinRoomCallback('room1', 'user1');
    expect(socket.join).toHaveBeenCalledWith('room1');
    expect(socket.to('room1').emit).toHaveBeenCalledWith(
      'user-joined',
      'user1'
    );

    // Simulate the 'disconnect' event
    const disconnectCallback = vi.mocked(socket.on).mock.calls[1][1];

    disconnectCallback();
    socket.rooms.forEach((room) => {
      expect(socket.to(room).emit).toHaveBeenCalledWith('user-left', socket.id);
      expect(socket.leave).toHaveBeenCalledWith(room);
    });
  });
});
