import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

passport.serializeUser((user: any, done) => {
  console.log('📦 Serializing user:', user.id || user._id);
  // Store entire user object in session when no MongoDB
  if (mongoose.connection.readyState !== 1) {
    return done(null, user);
  }
  done(null, user.id || user._id);
});

passport.deserializeUser(async (data: any, done) => {
  console.log('📂 Deserializing user:', typeof data === 'object' ? data.id : data);
  try {
    // If data is already a user object (no MongoDB), return it
    if (typeof data === 'object' && data.id) {
      console.log('⚠️  No MongoDB, using stored session user');
      return done(null, data);
    }
    
    // Otherwise fetch from MongoDB
    const user = await User.findById(data);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:3001'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
          console.log('⚠️  MongoDB not connected. Creating temporary user session.');
          // Create temporary user object for session
          const tempUser = {
            id: profile.id,
            googleId: profile.id,
            email: profile.emails?.[0].value || '',
            name: profile.displayName || '',
            picture: profile.photos?.[0].value || '',
            geminiApiKey: null
          };
          return done(null, tempUser);
        }

        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User exists, return it
          return done(null, user);
        }

        // Create new user
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0].value || '',
          name: profile.displayName || '',
          picture: profile.photos?.[0].value || '',
        });

        done(null, user);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

export default passport;