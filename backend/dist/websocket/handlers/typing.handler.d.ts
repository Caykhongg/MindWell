import type { WebSocket } from 'ws';
import type { RoomManager } from '../rooms.js';
interface TypingPayload {
    conversationId: number;
}
export declare function typingHandler(ws: WebSocket, userId: number, type: 'typing.start' | 'typing.stop', payload: TypingPayload, roomManager: RoomManager): void;
export {};
//# sourceMappingURL=typing.handler.d.ts.map