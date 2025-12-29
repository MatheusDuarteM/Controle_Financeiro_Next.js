// prisma.config.ts
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Aqui é onde o Prisma 7 lê as URLs agora
    url: process.env.DATABASE_URL,
    // Se precisar usar a directUrl (para migrações via Supabase), use assim:
    // directUrl: process.env.DIRECT_URL,
  },
});
