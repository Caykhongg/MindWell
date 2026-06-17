import { type Appointment, type NewAppointment } from '../db/schema/appointments.js';
export declare class AppointmentRepository {
    findByUserId(userId: number, page: number, limit: number): Promise<{
        entries: Appointment[];
        total: number;
    }>;
    findByTherapistId(therapistId: number, page: number, limit: number): Promise<{
        entries: Appointment[];
        total: number;
    }>;
    findById(id: number): Promise<Appointment | undefined>;
    findConflicting(date: Date, userId: number): Promise<Appointment | undefined>;
    create(data: NewAppointment): Promise<Appointment>;
    update(id: number, data: Partial<NewAppointment>): Promise<Appointment | undefined>;
    delete(id: number): Promise<void>;
}
//# sourceMappingURL=appointment.repository.d.ts.map