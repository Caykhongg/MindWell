import { z } from 'zod';
export declare const createPostSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    isAnonymous: z.ZodOptional<z.ZodBoolean>;
    guestName: z.ZodOptional<z.ZodString>;
    guestEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    isAnonymous?: boolean | undefined;
    guestName?: string | undefined;
    guestEmail?: string | undefined;
}, {
    title: string;
    content: string;
    isAnonymous?: boolean | undefined;
    guestName?: string | undefined;
    guestEmail?: string | undefined;
}>;
export declare const updatePostSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    isAnonymous: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    content?: string | undefined;
    isAnonymous?: boolean | undefined;
}, {
    title?: string | undefined;
    content?: string | undefined;
    isAnonymous?: boolean | undefined;
}>;
export declare const createCommentSchema: z.ZodObject<{
    content: z.ZodString;
    isAnonymous: z.ZodOptional<z.ZodBoolean>;
    guestName: z.ZodOptional<z.ZodString>;
    guestEmail: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    content: string;
    isAnonymous?: boolean | undefined;
    guestName?: string | undefined;
    guestEmail?: string | undefined;
}, {
    content: string;
    isAnonymous?: boolean | undefined;
    guestName?: string | undefined;
    guestEmail?: string | undefined;
}>;
//# sourceMappingURL=post.schema.d.ts.map