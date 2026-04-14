import { PrismaClient } from "@prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";
import "dotenv/config";

export const PRISMA_CLIENT = "PRISMA_CLIENT";

export const prismaClientProvider = {
  provide: PRISMA_CLIENT,
  useFactory: () => {
    const datasourceUrl = process.env.DATABASE_URL;
    if (!datasourceUrl) {
      throw new Error("DATABASE_URL is required for Prisma client.");
    }

    const adapter = new PrismaMssql({
      connectionString: datasourceUrl,
    });

    return new PrismaClient({
      adapter,
    });
  },
};
