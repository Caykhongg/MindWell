import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const hasFrontend = fs.existsSync(path.join(frontendDist, 'index.html'));
if (!hasFrontend) {
    logger.warn({ path: frontendDist }, 'Frontend dist not found — API only mode');
}
const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: config.cors.origin,
    credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use((req, _res, next) => {
    req.traceId = req.headers['x-trace-id'] || crypto.randomUUID();
    next();
});
app.use(routes);
if (hasFrontend) {
    app.use(express.static(frontendDist));
    app.use((req, res, next) => {
        if (req.path.startsWith('/api/'))
            return next();
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
}
else {
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/'))
            return next();
        res.status(503).json({
            success: false,
            error: { code: 'FRONTEND_NOT_BUILT', message: 'Frontend chưa được build. Liên hệ admin.' },
        });
    });
}
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map