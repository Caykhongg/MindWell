import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
export function counselorAvailabilityController(service) {
    return {
        getSchedule: asyncHandler(async (req, res) => {
            const availability = await service.getSchedule(req.userId);
            const timeOff = await service.getTimeOff(req.userId);
            res.json(success({ availability, timeOff }));
        }),
        setSchedule: asyncHandler(async (req, res) => {
            const { slots } = req.body;
            const result = await service.setSchedule(req.userId, slots);
            res.json(success(result));
        }),
        addTimeOff: asyncHandler(async (req, res) => {
            const { date, reason } = req.body;
            const result = await service.addTimeOff(req.userId, { date, reason });
            res.status(201).json(success(result));
        }),
        removeTimeOff: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            await service.removeTimeOff(id, req.userId);
            res.json(success({ message: 'Deleted' }));
        }),
    };
}
//# sourceMappingURL=counselor-availability.controller.js.map