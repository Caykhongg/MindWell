import { z } from 'zod';
export declare const createConversationSchema: z.ZodObject<{
    contactId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    contactId: number;
}, {
    contactId: number;
}>;
export declare const sendMessageSchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export declare const markReadSchema: z.ZodObject<{
    messageIds: z.ZodArray<z.ZodNumber, "many">;
}, "strip", z.ZodTypeAny, {
    messageIds: number[];
}, {
    messageIds: number[];
}>;
//# sourceMappingURL=chat.schema.d.ts.map