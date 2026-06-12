import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import postgres from 'postgres';
/*
 * it imports the initialization function required to connect Drizzle ORM to a database
 * specifically using the postgres (also known as postgres-js) driver.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private client: postgres.Sql;
  private readonly logger = new Logger(DrizzleService.name);
  public db: ReturnType<typeof drizzle>;
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing database connection string');
    }
    // 1. Safely parse variables with fallback defaults inside the constructor
    /*
     * This sets the absolute upper limit on how many active connections your application can open to PostgreSQL simultaneously.
     * How it works: If 30 users are fetching data at the same time, all 30 connections are busy.
     * If a 31st user makes a request, they don't get an error; instead, they are placed in a queue,
     * waiting for one of the first 30 operations to finish and release its connection back to the pool.
     * */
    const maxConnections = parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10);
    /**
     *  idle timeout in your constructor refers to how long a database connection can remain unused (idle) in the connection pool before it is automatically closed
     */
    const idleTimeout = Math.floor(
      parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10) / 1000,
    );
    /*
     * This is the grace period your application allows when trying to establish a physical connection to the database before giving up.
     * */
    const connectionTimeout = Math.floor(
      parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10) / 1000,
    );
    this.client = postgres(connectionString, {
      max: maxConnections,
      idle_timeout: idleTimeout,
      connect_timeout: connectionTimeout,
    });
    this.db = drizzle(this.client, { schema });
  }

  async onModuleInit(): Promise<void> {
    // Connection is established lazily, no need to explicitly connect
    this.logger.log('Drizzle service initialized');
  }
  async onModuleDestroy(): Promise<void> {
    await this.client.end();
    this.logger.log('Drizzle service destroyed');
  }
}
