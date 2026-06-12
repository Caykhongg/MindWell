import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { closeDatabase } from './config/database.js';
import { initWebSocketServer } from './websocket/index.js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import bcrypt from 'bcryptjs';
import { users } from './db/schema/users.js';
import { eq } from 'drizzle-orm';
import type { Server } from 'http';

let server: Server;

async function runMigrations() {
  try {
    const sql = postgres(config.database.url, { max: 1 });
    const db = drizzle(sql);
    logger.info('Running database migrations...');
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
    logger.info('Database migrations complete');

    const existing = await db.select().from(users).where(eq(users.email, 'admin@mindwell.com')).limit(1);
    if (existing.length === 0) {
      logger.info('Seeding default accounts...');
      const passwordHash = (pw: string) => bcrypt.hashSync(pw, config.bcrypt.rounds);
      await db.insert(users).values([
        { name: 'Admin', email: 'admin@mindwell.com', passwordHash: passwordHash('Admin123!'), role: 'admin', isActive: true },
        { name: 'Therapist', email: 'therapist@mindwell.com', passwordHash: passwordHash('Therapist123!'), role: 'therapist', isActive: true },
        { name: 'Patient', email: 'patient@mindwell.com', passwordHash: passwordHash('Patient123!'), role: 'patient', isActive: true },
      ]);
      logger.info('Seed complete');
    }

    await sql.end();
  } catch (err) {
    logger.error({ err }, 'Migration failed, starting server anyway');
  }
}

runMigrations().then(() => {
  server = app.listen(config.port, () => {
    logger.info(`MindWell API running on port ${config.port} [${config.nodeEnv}]`);
  });

  initWebSocketServer(server);
});

function shutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  if (!server) process.exit(0);
  server.close(async () => {
    logger.info('HTTP server closed');
    await closeDatabase();
    logger.info('Database connections closed');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
