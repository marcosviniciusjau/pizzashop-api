import { env } from '@/env';
export default {
    schema: './src/db/schema/index.ts',
    out: './src/drizzle',
    dialect: "postgresql",
    dbCredentials: {
        url: env.DB_URL,
    },
};
