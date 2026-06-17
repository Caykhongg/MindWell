export function presenceHandler(ws, userId, payload, roomManager) {
    const { status } = payload;
    if (!status || !['online', 'offline', 'away'].includes(status)) {
        ws.send(JSON.stringify({ event: 'error', payload: { message: 'Trạng thái không hợp lệ' } }));
        return;
    }
    roomManager.broadcast('presence:global', 'presence.update', {
        userId,
        status,
    });
}
//# sourceMappingURL=presence.handler.js.map