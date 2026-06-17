import { logger } from '../utils/logger.js';
export class CounselorAvailabilityService {
    availabilityRepo;
    constructor(availabilityRepo) {
        this.availabilityRepo = availabilityRepo;
    }
    async getSchedule(counselorId) {
        return this.availabilityRepo.findByCounselorId(counselorId);
    }
    async getTimeOff(counselorId) {
        return this.availabilityRepo.findTimeOff(counselorId);
    }
    async setSchedule(counselorId, slots) {
        const result = await this.availabilityRepo.setAvailability(counselorId, slots);
        logger.info({ counselorId, slotCount: slots.length }, 'Updated availability');
        return result;
    }
    async addTimeOff(counselorId, data) {
        const result = await this.availabilityRepo.addTimeOff(counselorId, data);
        logger.info({ counselorId, date: data.date }, 'Added time off');
        return result;
    }
    async removeTimeOff(id, counselorId) {
        await this.availabilityRepo.removeTimeOff(id);
        logger.info({ counselorId, timeOffId: id }, 'Removed time off');
    }
}
//# sourceMappingURL=counselor-availability.service.js.map