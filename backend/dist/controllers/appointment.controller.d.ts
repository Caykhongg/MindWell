import type { Response } from 'express';
import { AppointmentService } from '../services/appointment.service.js';
export declare function appointmentController(appointmentService: AppointmentService): {
    list: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    therapistList: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    getById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    create: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    updateStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    cancel: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=appointment.controller.d.ts.map