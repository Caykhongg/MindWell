import { CounselorAvailabilityRepository } from '../repositories/counselor-availability.repository.js';
import { ForbiddenError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class CounselorAvailabilityService {
  constructor(private availabilityRepo: CounselorAvailabilityRepository) {}

  async getSchedule(counselorId: number) {
    return this.availabilityRepo.findByCounselorId(counselorId);
  }

  async getTimeOff(counselorId: number) {
    return this.availabilityRepo.findTimeOff(counselorId);
  }

  async setSchedule(
    counselorId: number,
    slots: { dayOfWeek: string; startTime: string; endTime: string }[]
  ) {
    const result = await this.availabilityRepo.setAvailability(counselorId, slots);
    logger.info({ counselorId, slotCount: slots.length }, 'Updated availability');
    return result;
  }

  async addTimeOff(counselorId: number, data: { date: string; reason?: string }) {
    const result = await this.availabilityRepo.addTimeOff(counselorId, data);
    logger.info({ counselorId, date: data.date }, 'Added time off');
    return result;
  }

  async removeTimeOff(id: number, counselorId: number) {
    await this.availabilityRepo.removeTimeOff(id);
    logger.info({ counselorId, timeOffId: id }, 'Removed time off');
  }
}
