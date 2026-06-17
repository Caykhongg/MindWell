import type { WebSocket } from 'ws';
import type { RoomManager } from '../rooms.js';
interface PresencePayload {
    status: 'online' | 'offline' | 'away';
}
export declare function presenceHandler(ws: WebSocket, userId: number, payload: PresencePayload, roomManager: RoomManager): void;
export {};
//# sourceMappingURL=presence.handler.d.ts.map