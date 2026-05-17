import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import roastRoutes from './routes/roast.js';
import hooksRoutes from './routes/hooks.js';
import ctaRoutes from './routes/cta.js';
import analyticsRoutes from './routes/analytics.js';
import rewriteRoutes from './routes/rewrite.js';
import auditRoutes from './routes/audit.js';
import dnaRoutes from './routes/dna.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - supports both localhost (dev) and production domain
const getAllowedOrigins = () => {
  const siteUrl = process.env.VITE_SITE_URL || 'http://localhost:5174';
  const allowedOrigins = [
    siteUrl,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000',
    'http://localhost:3001',
  ];
  
  // Add www and http versions if https domain
  if (siteUrl.startsWith('https://')) {
    const domain = siteUrl.replace('https://', '');
    allowedOrigins.push(`https://www.${domain}`);
    allowedOrigins.push(`https://${domain}`);
  }
  
  return allowedOrigins;
};

// Middleware
app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Auth middleware - verify JWT token from Supabase
app.use((req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    req.token = token;
  }
  next();
});

// Routes
app.use('/api/roast', roastRoutes);
app.use('/api/rewrite', rewriteRoutes);
app.use('/api/hooks', hooksRoutes);
app.use('/api/cta', ctaRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dna', dnaRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'PostRoast Backend',
    environment: process.env.NODE_ENV || 'development',
    siteUrl: process.env.VITE_SITE_URL || 'http://localhost:5174'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500
  });
});

app.listen(PORT, () => {
  console.log(`🚀 PostRoast Backend running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Site URL: ${process.env.VITE_SITE_URL || 'http://localhost:5174'}`);
  console.log(`📡 Supabase connected to ${process.env.SUPABASE_URL}`);
  console.log(`✅ Allowed Origins:`, getAllowedOrigins());
});
