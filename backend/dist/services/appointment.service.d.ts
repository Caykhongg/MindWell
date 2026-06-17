import { AppointmentRepository } from '../repositories/appointment.repository.js';
export declare class AppointmentService {
    private appointmentRepo;
    constructor(appointmentRepo: AppointmentRepository);
    getEntries(userId: number, page: number, limit: number): Promise<{
        entries: import("../db/schema/appointments.js").Appointment[];
        total: number;
    }>;
    getTherapistEntries(therapistId: number, page: number, limit: number): Promise<{
        entries: import("../db/schema/appointments.js").Appointment[];
        total: number;
    }>;
    getEntry(id: number, userId: number): Promise<{
        date: Date;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        therapistId: number | null;
        status: string;
        notes: string | null;
        cancelReason: string | null;
    }>;
    createEntry(userId: number, data: {
        date: string;
        notes?: string;
    }): Promise<{
        date: Date;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        therapistId: number | null;
        status: string;
        notes: string | null;
        cancelReason: string | null;
    }>;
    updateStatus(id: number, userId: number, userRole: string, data: {
        status: string;
        cancelReason?: string;
    }): Promise<{
        date: Date;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        therapistId: number | null;
        status: string;
        notes: string | null;
        cancelReason: string | null;
    }>;
    cancelEntry(id: number, userId: number, userRole: string): Promise<void>;
}
//# sourceMappingURL=appointment.service.d.ts.map