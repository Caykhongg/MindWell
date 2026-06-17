export class RoomManager {
    rooms = new Map();
    userSockets = new Map();
    join(ws, channel, userId) {
        if (!this.rooms.has(channel)) {
            this.rooms.set(channel, new Map());
        }
        const room = this.rooms.get(channel);
        room.set(ws, { ws, userId });
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId).add(ws);
    }
    leave(ws, channel) {
        const room = this.rooms.get(channel);
        if (!room)
            return;
        const entry = room.get(ws);
        if (entry) {
            const userSockets = this.userSockets.get(entry.userId);
            if (userSockets) {
                userSockets.delete(ws);
                if (userSockets.size === 0) {
                    this.userSockets.delete(entry.userId);
                }
            }
        }
        room.delete(ws);
        if (room.size === 0) {
            this.rooms.delete(channel);
        }
    }
    leaveAll(ws) {
        for (const [channel, room] of this.rooms.entries()) {
            if (room.has(ws)) {
                this.leave(ws, channel);
            }
        }
    }
    broadcast(channel, event, payload) {
        const room = this.rooms.get(channel);
        if (!room)
            return;
        const message = JSON.stringify({ event, payload });
        for (const [, entry] of room.entries()) {
            if (entry.ws.readyState === entry.ws.OPEN) {
                entry.ws.send(message);
            }
        }
    }
    broadcastToUserSockets(userId, event, payload) {
        const sockets = this.userSockets.get(userId);
        if (!sockets)
            return;
        const message = JSON.stringify({ event, payload });
        for (const ws of sockets) {
            if (ws.readyState === ws.OPEN) {
                ws.send(message);
            }
        }
    }
    getRoomSize(channel) {
        return this.rooms.get(channel)?.size ?? 0;
    }
    getUsersInRoom(channel) {
        const room = this.rooms.get(channel);
        if (!room)
            return [];
        const userIds = new Set();
        for (const [, entry] of room.entries()) {
            userIds.add(entry.userId);
        }
        return Array.from(userIds);
    }
}
//# sourceMappingURL=rooms.js.map