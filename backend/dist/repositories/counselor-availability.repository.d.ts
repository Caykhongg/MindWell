import { type CounselorAvailability, type CounselorTimeOff } from '../db/schema/counselor-availability.js';
export declare class CounselorAvailabilityRepository {
    findByCounselorId(counselorId: number): Promise<CounselorAvailability[]>;
    setAvailability(counselorId: number, slots: {
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
    findTimeOff(counselorId: number): Promise<CounselorTimeOff[]>;
    addTimeOff(counselorId: number, data: {
        date: string;
        reason?: string;
    }): Promise<{
        date: string;
        id: number;
        counselorId: number;
        reason: string | null;
    }[]>;
    removeTimeOff(id: number): Promise<void>;
    getAllAvailableTherapists(): Promise<{
        id: number;
    }[]>;
    isTherapistAvailable(therapistId: number): Promise<boolean>;
}
//# sourceMappingURL=counselor-availability.repository.d.ts.map