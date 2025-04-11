import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
// import { Logger } from '@/common/logger';
// import { di } from '@/common/di';

// Define type that includes schema
export type Database = NodePgDatabase<typeof schema>;

// Singleton instance with proper typing
let drizzleInstance: Database | null = null;

export function useDrizzle(): Database {
  const { DATABASE_URL } = process.env;

  // di.resolve(Logger).info({ DATABASE_URL });
  if (!drizzleInstance) {
    drizzleInstance = drizzle(DATABASE_URL!, {
      casing: 'snake_case',
      schema
    });
  }

  return drizzleInstance;
}

// Since we now have a proper Database type, we can simplify these types
export type DrizzleTransaction = Parameters<
  Parameters<Database['transaction']>[0]
>[0];

export type DbType = Database;

// custom lower function
export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}

// custom upper function
export function upper(email: AnyPgColumn): SQL {
  return sql`upper(${email})`;
}
