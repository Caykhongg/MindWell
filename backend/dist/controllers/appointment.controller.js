import { asyncHandler } from '../middleware/async-handler.js';
import { success, paginated } from '../utils/response.js';
export function appointmentController(appointmentService) {
    return {
        list: asyncHandler(async (req, res) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const { entries, total } = await appointmentService.getEntries(req.userId, page, limit);
            res.json(paginated(entries, total, page, limit));
        }),
        therapistList: asyncHandler(async (req, res) => {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 20;
            const { entries, total } = await appointmentService.getTherapistEntries(req.userId, page, limit);
            res.json(paginated(entries, total, page, limit));
        }),
        getById: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const appointment = await appointmentService.getEntry(id, req.userId);
            res.json(success(appointment));
        }),
        create: asyncHandler(async (req, res) => {
            const { date, notes } = req.body;
            const appointment = await appointmentService.createEntry(req.userId, { date, notes });
            res.status(201).json(success(appointment));
        }),
        updateStatus: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            const { status, cancelReason } = req.body;
            const appointment = await appointmentService.updateStatus(id, req.userId, req.userRole, { status, cancelReason });
            res.json(success(appointment));
        }),
        cancel: asyncHandler(async (req, res) => {
            const id = parseInt(req.params.id, 10);
            await appointmentService.cancelEntry(id, req.userId, req.userRole);
            res.json(success({ message: 'Huỷ lịch hẹn thành công' }));
        }),
    };
}
//# sourceMappingURL=appointment.controller.js.map