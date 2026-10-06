import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'ts-node --transpile-only prisma/seed.ts',
  },
  datasource: {
    // The direct (port 5432) connection: migrations cannot run through the pooler. The app itself uses DATABASE_URL.
    url: process.env["DIRECT_URL"],
  },
});
