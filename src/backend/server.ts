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

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from frontend
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