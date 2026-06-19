import { z } from 'zod';
export declare const submitTestSchema: z.ZodObject<{
    answers: z.ZodArray<z.ZodNumber, "many">;
    testType: z.ZodString;
}, "strip", z.ZodTypeAny, {
    answers: number[];
    testType: string;
}, {
    answers: number[];
    testType: string;
}>;
//# sourceMappingURL=test.schema.d.ts.map