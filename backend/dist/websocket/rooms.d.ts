import type { WebSocket } from 'ws';
export declare class RoomManager {
    private rooms;
    private userSockets;
    join(ws: WebSocket, channel: string, userId: number): void;
    leave(ws: WebSocket, channel: string): void;
    leaveAll(ws: WebSocket): void;
    broadcast(channel: string, event: string, payload: unknown): void;
    broadcastToUserSockets(userId: number, event: string, payload: unknown): void;
    getRoomSize(channel: string): number;
    getUsersInRoom(channel: string): number[];
}
//# sourceMappingURL=rooms.d.ts.map