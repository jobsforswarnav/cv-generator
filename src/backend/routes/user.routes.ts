import express, { Request, Response } from 'express';
import User from '../models/User';

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// Get user settings
router.get('/settings', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req.user as any)._id);
    res.json({
      geminiApiKey: user?.geminiApiKey ? '****' + user.geminiApiKey.slice(-4) : null,
      hasApiKey: !!user?.geminiApiKey
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update Gemini API key
router.post('/settings/api-key', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || !apiKey.startsWith('AIzaSy')) {
      return res.status(400).json({ error: 'Invalid Gemini API key format' });
    }

    await User.findByIdAndUpdate((req.user as any)._id, {
      geminiApiKey: apiKey
    });

    res.json({ message: 'API key updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update API key' });
  }
});

export default router;