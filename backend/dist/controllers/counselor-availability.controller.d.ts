import type { Response } from 'express';
import { CounselorAvailabilityService } from '../services/counselor-availability.service.js';
export declare function counselorAvailabilityController(service: CounselorAvailabilityService): {
    getSchedule: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    setSchedule: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    addTimeOff: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    removeTimeOff: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=counselor-availability.controller.d.ts.map