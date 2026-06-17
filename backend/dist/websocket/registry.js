let _roomManager = null;
export function setRoomManager(rm) {
    _roomManager = rm;
}
export function getRoomManager() {
    if (!_roomManager) {
        throw new Error('RoomManager not initialized');
    }
    return _roomManager;
}
//# sourceMappingURL=registry.js.map