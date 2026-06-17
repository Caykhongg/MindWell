import { z } from 'zod';
export declare const botChatSchema: z.ZodObject<{
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
}, {
    message: string;
}>;
export declare const createBotReplySchema: z.ZodObject<{
    keywords: z.ZodString;
    reply: z.ZodString;
}, "strip", z.ZodTypeAny, {
    keywords: string;
    reply: string;
}, {
    keywords: string;
    reply: string;
}>;
export declare const updateBotReplySchema: z.ZodObject<{
    keywords: z.ZodOptional<z.ZodString>;
    reply: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    keywords?: string | undefined;
    reply?: string | undefined;
}, {
    keywords?: string | undefined;
    reply?: string | undefined;
}>;
export declare const botFeedbackSchema: z.ZodObject<{
    messageText: z.ZodString;
    botReply: z.ZodString;
    helpful: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    messageText: string;
    botReply: string;
    helpful: number;
}, {
    messageText: string;
    botReply: string;
    helpful: number;
}>;
//# sourceMappingURL=bot.schema.d.ts.map