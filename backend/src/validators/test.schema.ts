import { z } from 'zod';

export const submitTestSchema = z.object({
  answers: z.array(z.number().min(0).max(3)).min(1, 'Cần ít nhất 1 câu trả lời'),
  testType: z.string().min(1, 'Loại bài kiểm tra không được để trống'),
});
