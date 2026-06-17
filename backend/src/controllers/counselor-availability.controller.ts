import type { Response } from 'express';
import { CounselorAvailabilityService } from '../services/counselor-availability.service.js';
import { asyncHandler } from '../middleware/async-handler.js';
import { success } from '../utils/response.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

export function counselorAvailabilityController(service: CounselorAvailabilityService) {
  return {
    getSchedule: asyncHandler(async (req: AuthRequest, res: Response) => {
      const availability = await service.getSchedule(req.userId!);
      const timeOff = await service.getTimeOff(req.userId!);
      res.json(success({ availability, timeOff }));
    }),

    setSchedule: asyncHandler(async (req: AuthRequest, res: Response) => {
      const { slots } = req.body;
      const result = await service.setSchedule(req.userId!, slots);
      res.json(success(result));
    }),

    addTimeOff: asyncHandler(async (req: AuthRequest, res: Response) => {
      const { date, reason } = req.body;
      const result = await service.addTimeOff(req.userId!, { date, reason });
      res.status(201).json(success(result));
    }),

    removeTimeOff: asyncHandler(async (req: AuthRequest, res: Response) => {
      const id = parseInt(req.params.id as string, 10);
      await service.removeTimeOff(id, req.userId!);
      res.json(success({ message: 'Deleted' }));
    }),
  };
}
