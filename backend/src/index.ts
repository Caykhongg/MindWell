import app from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { closeDatabase } from './config/database.js';
import { initWebSocketServer, closeWebSocketServer } from './websocket/index.js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { users } from './db/schema/users.js';
import { posts, comments } from './db/schema/posts.js';
import { count, eq } from 'drizzle-orm';
import type { Server } from 'http';
import type { Socket } from 'net';
import * as readline from 'node:readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let server: Server;
const connections = new Set<Socket>();
let shuttingDown = false;

async function waitForDb(attempts = 15, interval = 2000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      const sql = postgres(config.database.url, { max: 1, connect_timeout: 5 });
      await sql`SELECT 1`;
      await sql.end();
      return true;
    } catch {
      logger.warn(`DB chưa sẵn sàng (lần ${i}/${attempts}), thử lại sau ${interval}ms...`);
      await new Promise(r => setTimeout(r, interval));
    }
  }
  return false;
}

async function runMigrations() {
  const dbReady = await waitForDb();
  if (!dbReady) {
    logger.error('Không thể kết nối database sau nhiều lần thử. Kiểm tra DATABASE_URL');
    return;
  }

  try {
    const sql = postgres(config.database.url, { max: 1 });
    const db = drizzle(sql);
    logger.info('Running database migrations...');
    await migrate(db, { migrationsFolder: path.resolve(__dirname, 'db/migrations') });
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

    // Ensure toita1234567@gmail.com is admin with known password
    const toitaPwHash = (pw: string) => bcrypt.hashSync(pw, config.bcrypt.rounds);
    const toitaUser = await db.select().from(users).where(eq(users.email, 'toita1234567@gmail.com')).limit(1);
    if (toitaUser.length > 0) {
      await db.update(users).set({ role: 'admin', passwordHash: toitaPwHash('Toita123!') }).where(eq(users.email, 'toita1234567@gmail.com'));
      logger.info({ email: 'toita1234567@gmail.com' }, 'Reset password and promoted to admin');
    } else {
      await db.insert(users).values([
        { name: 'Toita', email: 'toita1234567@gmail.com', passwordHash: toitaPwHash('Toita123!'), role: 'admin', isActive: true },
      ]);
      logger.info({ email: 'toita1234567@gmail.com' }, 'Created admin account');
    }

    // Seed sample post + comment if no posts exist
    const [postCount] = await db.select({ total: count() }).from(posts);
    if (postCount.total === 0) {
      const adminUser = await db.select().from(users).where(eq(users.email, 'admin@mindwell.com')).limit(1);
      if (adminUser.length > 0) {
        const [post] = await db.insert(posts).values({
          userId: adminUser[0].id,
          title: 'Chào mừng bạn đến với MindWell!',
          content: 'Đây là bài viết mẫu. Hãy chia sẻ cảm xúc của bạn và kết nối với cộng đồng nhé!',
          isAnonymous: 0,
        }).returning();
        await db.insert(comments).values({
          postId: post.id,
          userId: adminUser[0].id,
          content: 'Chào mừng bạn! Hy vọng bạn sẽ tìm thấy sự hỗ trợ tại đây.',
          isAnonymous: 0,
        });
        logger.info('Sample post and comment seeded');
      }
    }

    await sql.end();
  } catch (err) {
    logger.error({ err }, 'Migration failed, starting server anyway');
  }
}

server = app.listen(config.port, () => {
  logger.info({
    port: config.port,
    env: config.nodeEnv,
    db: config.database.url ? 'set' : 'missing',
    jwtAccess: config.jwt.accessSecret.length > 20 ? 'custom' : 'default',
    corsOrigin: config.cors.origin,
  }, 'MindWell API started');
});

server.on('connection', (socket: Socket) => {
  connections.add(socket);
  socket.on('close', () => connections.delete(socket));
});

initWebSocketServer(server);

runMigrations().catch((err) => {
  logger.error({ err }, 'Migration failed');
});

function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`Received ${signal}, shutting down...`);
  if (server) {
    closeWebSocketServer();
    for (const socket of connections) {
      socket.destroy();
    }
    connections.clear();
    server.close();
  }
  closeDatabase().catch(() => {});
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

if (process.stdin.isTTY) {
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('SIGINT', () => {
    rl.close();
    shutdown('Ctrl+C');
  });
}
