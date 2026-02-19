// Load environment variables FIRST, before any imports
import dotenv from 'dotenv';
dotenv.config();

// Debug: Check if API key is loaded
console.log('🔑 Checking API key...');
if (process.env.ANTHROPIC_API_KEY) {
  console.log('✅ API key found:', process.env.ANTHROPIC_API_KEY.substring(0, 20) + '...');
} else {
  console.log('❌ API key NOT found! Check your .env file');
}

// NOW import everything else
import express from 'express';
import cors from 'cors';
import cvRoutes from './routes/cv.routes';
import path from 'path';
import fs from 'fs';

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Ensure required directories exist
// Use /tmp on production (Render), local paths in development
const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, '../../uploads');
const tempDir = process.env.NODE_ENV === 'production' ? '/tmp/temp' : path.join(__dirname, '../../temp');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

// Export for use in routes
export { uploadsDir, tempDir };

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
})); // Allow requests from frontend with credentials
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../../public')));

// In production, serve the built frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend')));
  
  // All other GET routes (not /api) return the React app
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  });
}

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import session from 'express-session';
import passport from './config/passport';
import mongoose from 'mongoose';

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      console.log('⚠️  App will continue without MongoDB. User data will not persist.');
    });
} else {
  console.log('⚠️  No MongoDB URI found. Running without database.');
}

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'cv-generator-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cv', cvRoutes);

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'CV Generator API',
    version: '1.0.0',
    endpoints: {
      health: '/api/cv/health',
      generate: 'POST /api/cv/generate'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 CV Generator API Server');
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/cv/health`);
  console.log('\n✨ Ready to generate CVs!\n');
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing server');
  process.exit(0);
});