import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { RoomManager } from './rooms.js';
import { messageHandler } from './handlers/message.handler.js';
import { typingHandler } from './handlers/typing.handler.js';
import { presenceHandler } from './handlers/presence.handler.js';
import { MessageRepository } from '../repositories/message.repository.js';
import { ConversationRepository } from '../repositories/conversation.repository.js';
import { logger } from '../utils/logger.js';
import { setRoomManager } from './registry.js';
const HEARTBEAT_INTERVAL = 30000;
const HEARTBEAT_TIMEOUT = 60000;
let _wss = null;
let _heartbeatTimer = null;
const messageRepo = new MessageRepository();
const conversationRepo = new ConversationRepository();
export function initWebSocketServer(httpServer) {
    _wss = new WebSocketServer({ server: httpServer });
    const roomManager = new RoomManager();
    _heartbeatTimer = setInterval(() => {
        if (!_wss)
            return;
        _wss.clients.forEach((ws) => {
            const socket = ws;
            if (!socket.isAlive) {
                logger.info({ userId: socket.userId }, 'WS heartbeat timeout, disconnecting');
                return socket.terminate();
            }
            socket.isAlive = false;
            socket.ping();
        });
    }, HEARTBEAT_INTERVAL);
    _wss.on('close', () => {
        if (_heartbeatTimer)
            clearInterval(_heartbeatTimer);
    });
    _wss.on('connection', (ws, req) => {
        const socket = ws;
        socket.isAlive = true;
        const cookie = req.headers.cookie || '';
        const token = cookie
            .split(';')
            .find((c) => c.trim().startsWith('accessToken='))
            ?.split('=')[1]
            ?.trim();
        if (!token) {
            socket.close(4001, 'Vui lòng đăng nhập');
            return;
        }
        try {
            const decoded = jwt.verify(token, config.jwt.accessSecret);
            socket.userId = decoded.userId;
        }
        catch {
            socket.close(4001, 'Token hết hạn, vui lòng đăng nhập lại');
            return;
        }
        const userId = socket.userId;
        logger.info({ userId }, 'WS client connected');
        socket.on('pong', () => {
            socket.isAlive = true;
        });
        socket.on('message', (rawData) => {
            let parsed;
            try {
                parsed = JSON.parse(rawData.toString());
            }
            catch {
                socket.send(JSON.stringify({ event: 'error', payload: { message: 'Dữ liệu không hợp lệ' } }));
                return;
            }
            const { type, payload } = parsed;
            switch (type) {
                case 'room.join':
                    if (payload && typeof payload === 'object' && 'channel' in payload) {
                        const { channel } = payload;
                        roomManager.join(socket, channel, userId);
                        socket.send(JSON.stringify({ event: 'room.joined', payload: { channel } }));
                    }
                    break;
                case 'room.leave':
                    if (payload && typeof payload === 'object' && 'channel' in payload) {
                        const { channel } = payload;
                        roomManager.leave(socket, channel);
                    }
                    break;
                case 'message.send':
                    messageHandler(socket, userId, payload, roomManager, messageRepo, conversationRepo);
                    break;
                case 'typing.start':
                case 'typing.stop':
                    typingHandler(socket, userId, type, payload, roomManager);
                    break;
                case 'presence.update':
                    presenceHandler(socket, userId, payload, roomManager);
                    break;
                case 'ping':
                    break;
                case 'typing':
                    typingHandler(socket, userId, 'typing.start', payload, roomManager);
                    break;
                default:
                    socket.send(JSON.stringify({ event: 'error', payload: { message: `Loại tin nhắn không hỗ trợ: ${type}` } }));
            }
        });
        socket.on('close', () => {
            roomManager.leaveAll(socket);
            roomManager.broadcast('presence:global', 'presence.update', {
                userId,
                status: 'offline',
            });
            logger.info({ userId }, 'WS client disconnected');
        });
        socket.on('error', (err) => {
            logger.error({ err, userId }, 'WS client error');
        });
        roomManager.broadcast('presence:global', 'presence.update', {
            userId,
            status: 'online',
        });
        socket.send(JSON.stringify({ event: 'connected', payload: { userId } }));
    });
    setRoomManager(roomManager);
    logger.info('WebSocket server initialized');
    return roomManager;
}
export function closeWebSocketServer() {
    if (_heartbeatTimer) {
        clearInterval(_heartbeatTimer);
        _heartbeatTimer = null;
    }
    if (_wss) {
        _wss.clients.forEach((client) => client.terminate());
        _wss.close();
        _wss = null;
    }
}
//# sourceMappingURL=index.js.map