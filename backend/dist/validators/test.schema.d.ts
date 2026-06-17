import { z } from 'zod';
export declare const submitTestSchema: z.ZodEffects<z.ZodObject<{
    answers: z.ZodArray<z.ZodNumber, "many">;
    testType: z.ZodEnum<["phq9", "gad7", "general"]>;
}, "strip", z.ZodTypeAny, {
    answers: number[];
    testType: "phq9" | "gad7" | "general";
}, {
    answers: number[];
    testType: "phq9" | "gad7" | "general";
}>, {
    answers: number[];
    testType: "phq9" | "gad7" | "general";
}, {
    answers: number[];
    testType: "phq9" | "gad7" | "general";
}>;
//# sourceMappingURL=test.schema.d.ts.map