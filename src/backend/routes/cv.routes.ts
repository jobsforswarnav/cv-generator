import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs/promises';
import { ParserService } from '../services/parser.service';
import { AIService } from '../services/ai.service';
import { DocxService } from '../services/docx.service';
import { CVInput } from '../types';

const router = express.Router();

// Configure file upload
// Use /tmp on production (Render), local paths in development
const uploadsDir = process.env.NODE_ENV === 'production' ? '/tmp/uploads' : path.join(__dirname, '../../uploads');
const tempDir = process.env.NODE_ENV === 'production' ? '/tmp/temp' : path.join(__dirname, '../../temp');

// Ensure directories exist
const fsSync = require('fs');
if (!fsSync.existsSync(uploadsDir)) fsSync.mkdirSync(uploadsDir, { recursive: true });
if (!fsSync.existsSync(tempDir)) fsSync.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save to uploads folder
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-originalname.docx
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Only accept DOCX files
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// Initialize services
import { GeminiAIService } from '../services/gemini-ai.service';

// Initialize services
const parserService = new ParserService();
const docxService = new DocxService();

// Initialize BOTH AI services
const claudeService = new AIService(process.env.ANTHROPIC_API_KEY || '');
const geminiService = new GeminiAIService(process.env.GEMINI_API_KEY || '');

/**
 * POST /api/cv/generate
 * Main endpoint: Upload CV and generate optimized version
 */
router.post('/generate', upload.single('cv'), async (req: Request, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }

    // Get the form data
    const cvInput: CVInput = {
      jobDescription: req.body.jobDescription || '',
      personalPreferences: req.body.personalPreferences || '',
      additionalNotes: req.body.additionalNotes || '',
      tone: req.body.tone || 'professional',
      length: req.body.length || '2-page'
    };

    console.log('📄 Processing CV:', req.file.filename);
    console.log('📋 Job Description:', cvInput.jobDescription.substring(0, 100) + '...');

    // Step 1: Parse the uploaded CV
    console.log('🔍 Parsing CV...');
    const parsedCV = await parserService.parseDocx(req.file.path);

    // Step 2: Send to AI for optimization
    // Step 2: Send to AI for optimization
    console.log('🤖 Generating optimized CV with AI...');
    
    // Choose which AI to use based on user selection
    const aiProvider = cvInput.aiProvider || 'gemini'; // Default to Gemini (free!)
    let optimizedCV;
    
    if (aiProvider === 'claude') {
      console.log('   Using Claude AI');
      optimizedCV = await claudeService.generateOptimizedCV(parsedCV, cvInput);
    } else {
      console.log('   Using Google Gemini (Free!)');
      optimizedCV = await geminiService.generateOptimizedCV(parsedCV, cvInput);
    }

    // Step 3: Generate DOCX file
    console.log('📝 Creating DOCX file...');
    const outputFilename = `optimized-${Date.now()}.docx`;
    const outputPath = path.join(tempDir, outputFilename);
    await docxService.generateDocx(optimizedCV, outputPath);

    // Step 4: Send file to user
    console.log('✅ Sending file to user...');
    res.download(outputPath, 'optimized-cv.docx', async (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }

      // Clean up: delete temporary files
      try {
        await fs.unlink(req.file!.path); // Delete uploaded file
        await fs.unlink(outputPath); // Delete generated file
        console.log('🗑️ Cleaned up temporary files');
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    });

  } catch (error) {
    console.error('❌ Error generating CV:', error);
    
    // Clean up uploaded file on error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    res.status(500).json({ 
      error: 'Failed to generate CV', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/cv/health
 * Check if the API is running
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'CV Generator API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;