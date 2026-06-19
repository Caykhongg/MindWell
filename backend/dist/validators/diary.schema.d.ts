import { z } from 'zod';
export declare const createDiarySchema: z.ZodObject<{
    content: z.ZodString;
    mood: z.ZodEnum<["happy", "sad", "anxious", "calm", "stressed", "angry"]>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    content: string;
    mood: "happy" | "sad" | "anxious" | "calm" | "stressed" | "angry";
    tags?: string[] | undefined;
}, {
    content: string;
    mood: "happy" | "sad" | "anxious" | "calm" | "stressed" | "angry";
    tags?: string[] | undefined;
}>;
export declare const updateDiarySchema: z.ZodObject<{
    content: z.ZodOptional<z.ZodString>;
    mood: z.ZodOptional<z.ZodEnum<["happy", "sad", "anxious", "calm", "stressed", "angry"]>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    tags?: string[] | undefined;
    content?: string | undefined;
    mood?: "happy" | "sad" | "anxious" | "calm" | "stressed" | "angry" | undefined;
}, {
    tags?: string[] | undefined;
    content?: string | undefined;
    mood?: "happy" | "sad" | "anxious" | "calm" | "stressed" | "angry" | undefined;
}>;
//# sourceMappingURL=diary.schema.d.ts.map