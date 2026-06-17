export function typingHandler(ws, userId, type, payload, roomManager) {
    const { conversationId } = payload;
    if (!conversationId) {
        ws.send(JSON.stringify({ event: 'error', payload: { message: 'Dữ liệu không hợp lệ' } }));
        return;
    }
    const event = type === 'typing.start' ? 'typing.start' : 'typing.stop';
    const channel = `conversation:${conversationId}`;
    roomManager.broadcast(channel, event, {
        conversationId,
        userId,
    });
}
//# sourceMappingURL=typing.handler.js.map