import postgres from 'postgres';
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<Record<string, never>> & {
    $client: postgres.Sql<{}>;
};
export declare function checkDatabase(): Promise<boolean>;
export declare function closeDatabase(): Promise<void>;
//# sourceMappingURL=database.d.ts.map