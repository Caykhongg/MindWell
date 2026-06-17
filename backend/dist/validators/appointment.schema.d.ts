import { z } from 'zod';
export declare const createAppointmentSchema: z.ZodObject<{
    date: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    notes?: string | undefined;
}, {
    date: string;
    notes?: string | undefined;
}>;
export declare const updateAppointmentStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "confirmed", "cancelled", "completed"]>;
    cancelReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "confirmed" | "cancelled" | "completed";
    cancelReason?: string | undefined;
}, {
    status: "pending" | "confirmed" | "cancelled" | "completed";
    cancelReason?: string | undefined;
}>;
//# sourceMappingURL=appointment.schema.d.ts.map