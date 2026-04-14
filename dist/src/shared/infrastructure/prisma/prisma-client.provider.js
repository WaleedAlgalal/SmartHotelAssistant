"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClientProvider = exports.PRISMA_CLIENT = void 0;
const client_1 = require("@prisma/client");
const adapter_mssql_1 = require("@prisma/adapter-mssql");
require("dotenv/config");
exports.PRISMA_CLIENT = "PRISMA_CLIENT";
exports.prismaClientProvider = {
    provide: exports.PRISMA_CLIENT,
    useFactory: () => {
        const datasourceUrl = process.env.DATABASE_URL;
        if (!datasourceUrl) {
            throw new Error("DATABASE_URL is required for Prisma client.");
        }
        const adapter = new adapter_mssql_1.PrismaMssql({
            connectionString: datasourceUrl,
        });
        return new client_1.PrismaClient({
            adapter,
        });
    },
};
//# sourceMappingURL=prisma-client.provider.js.map