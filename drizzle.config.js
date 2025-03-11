import { env } from '@/env';
export default {
    schema: './src/db/schema/index.ts',
    out: './drizzle',
    dialect: "postgresql",
    dbCredentials: {
        url: env.DB_URL,
    },
};
