// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './models/index.js';
import cookieParser from 'cookie-parser'
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://your-domain.com'
    : (origin, cb) => {
        if (!origin) return cb(null, true);
        if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
          return cb(null, true);
        }
        cb(new Error('Not allowed by CORS'));
      },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Basic route
app.get('/api', (req, res) => {
  res.json({
    message: 'Car Dealership API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get('/health', async (req, res) => {
  const timeoutMs = 3000;
  try {
    await Promise.race([
      testConnection(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`DB check timed out after ${timeoutMs}ms`)), timeoutMs)
      ),
    ]);
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

import adminRouts from './routes/admin.auth.routes.js';
import authRoutes from './routes/user.auth.routes.js';
import adminOpRoutes from './routes/admin.operations.routes.js';
import carRoutes from './routes/car.routes.js';
import blogRoutes from './routes/blog.routes.js';
import interactRoutes from './routes/interactions.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import adminStaffRoutes from './routes/adminStaff.routes.js';
import broadcastRoutes from './routes/broadcast.routes.js';
import profitabilityRoutes from './routes/profitability.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import locationRoutes from './routes/location.routes.js';
import { globalErrorHandler, notFound } from './middleware/error.middleware.js';

app.use('/api/admin/auth', adminRouts);
app.use('/api/user/auth', authRoutes);
app.use('/api/admin/ops', adminOpRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/interactions', interactRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/profitability', profitabilityRoutes);
app.use('/api/admin/staff', adminStaffRoutes);
app.use('/api/admin/broadcast', broadcastRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes);
// Serve frontend static assets in production before the 404 handler
// Skip on Vercel — Vercel serves the static frontend directly via outputDirectory.
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  // __dirname is the backend folder when started from backend/ (start script: node src/index.js)
  // frontend is a sibling folder of backend, so go up one level to reach it.
  const frontendDistPath = path.join(__dirname, '../frontend', 'dist');

  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    // If the request is for an API route, skip and allow API routes/handlers to run
    if (req.originalUrl.startsWith('/api')) return next();

    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 handler (placed after static serving and API routes)
app.use(notFound);
app.use(globalErrorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    console.log('✅ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API endpoint: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;
