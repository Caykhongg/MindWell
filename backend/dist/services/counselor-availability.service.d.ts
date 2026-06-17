import { CounselorAvailabilityRepository } from '../repositories/counselor-availability.repository.js';
export declare class CounselorAvailabilityService {
    private availabilityRepo;
    constructor(availabilityRepo: CounselorAvailabilityRepository);
    getSchedule(counselorId: number): Promise<{
        id: number;
        counselorId: number;
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }[]>;
    getTimeOff(counselorId: number): Promise<{
        date: string;
        id: number;
        counselorId: number;
        reason: string | null;
    }[]>;
    setSchedule(counselorId: number, slots: {
        dayOfWeek: string;
        startTime: string;
        endTime: string;
    }[]): Promise<{
        id: number;
        counselorId: number;
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }[]>;
    addTimeOff(counselorId: number, data: {
        date: string;
        reason?: string;
    }): Promise<{
        date: string;
        id: number;
        counselorId: number;
        reason: string | null;
    }[]>;
    removeTimeOff(id: number, counselorId: number): Promise<void>;
}
//# sourceMappingURL=counselor-availability.service.d.ts.map