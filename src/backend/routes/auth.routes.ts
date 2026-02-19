import express from 'express';
import passport from 'passport';

const router = express.Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('✅ Google auth successful, user:', req.user);
    // Successful authentication, redirect to frontend
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(clientUrl);
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/current-user', (req, res) => {
  console.log('🔍 Checking auth:', req.isAuthenticated());
  console.log('👤 Session user:', req.user);
  
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: (req.user as any)._id || (req.user as any).id,
        name: (req.user as any).name,
        email: (req.user as any).email,
        picture: (req.user as any).picture,
        hasApiKey: !!(req.user as any).geminiApiKey
      }
    });
  } else {
    res.json({ user: null });
  }
});

export default router;