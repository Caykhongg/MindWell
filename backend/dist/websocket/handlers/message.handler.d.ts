import type { WebSocket } from 'ws';
import type { RoomManager } from '../rooms.js';
import { MessageRepository } from '../../repositories/message.repository.js';
import { ConversationRepository } from '../../repositories/conversation.repository.js';
interface MessageSendPayload {
    conversationId: number;
    text: string;
}
export declare function messageHandler(ws: WebSocket, userId: number, payload: MessageSendPayload, roomManager: RoomManager, messageRepo: MessageRepository, conversationRepo: ConversationRepository): void;
export {};
//# sourceMappingURL=message.handler.d.ts.map