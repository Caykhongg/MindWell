import { z } from 'zod';
export declare const questionSchema: z.ZodObject<{
    questionText: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        label: string;
    }, {
        value: number;
        label: string;
    }>, "many">;
    orderIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    options: {
        value: number;
        label: string;
    }[];
    questionText: string;
    orderIndex: number;
}, {
    options: {
        value: number;
        label: string;
    }[];
    questionText: string;
    orderIndex: number;
}>;
export declare const createTestTemplateSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    options: z.ZodObject<{
        questions: z.ZodArray<z.ZodObject<{
            questionText: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                value: number;
                label: string;
            }, {
                value: number;
                label: string;
            }>, "many">;
            orderIndex: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }, {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    }, {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    title: string;
    options: {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    };
    description?: string | undefined;
}, {
    title: string;
    options: {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    };
    description?: string | undefined;
}>;
export declare const updateTestTemplateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    options: z.ZodOptional<z.ZodObject<{
        questions: z.ZodArray<z.ZodObject<{
            questionText: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                value: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                value: number;
                label: string;
            }, {
                value: number;
                label: string;
            }>, "many">;
            orderIndex: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }, {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    }, {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    }>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    title?: string | undefined;
    options?: {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    } | undefined;
}, {
    description?: string | undefined;
    title?: string | undefined;
    options?: {
        questions: {
            options: {
                value: number;
                label: string;
            }[];
            questionText: string;
            orderIndex: number;
        }[];
    } | undefined;
}>;
//# sourceMappingURL=test-template.schema.d.ts.map