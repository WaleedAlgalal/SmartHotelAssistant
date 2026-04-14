import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import "dotenv/config";
export declare const PRISMA_CLIENT = "PRISMA_CLIENT";
export declare const prismaClientProvider: {
    provide: string;
    useFactory: () => PrismaClient<{
        adapter: PrismaMssql;
    }, never, import("@prisma/client/runtime/client").DefaultArgs>;
};
