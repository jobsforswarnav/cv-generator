# Google OAuth Authentication - Installation Guide

## Required NPM Packages

Run these commands to install all required dependencies:

```bash
# Backend dependencies
npm install express-session passport passport-google-oauth20 mongoose @types/express-session @types/passport @types/passport-google-oauth20

# Frontend dependencies
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

## Environment Variables

Add these to your `.env` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session
SESSION_SECRET=your_random_secret_key

# URLs
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000

# Existing variables
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3001/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

## MongoDB Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env` as MONGODB_URI

## Testing

1. Start backend: `npm run dev` (in backend directory)
2. Start frontend: `npm run dev` (in frontend directory)
3. Visit `http://localhost:3000`
4. Click "Sign in with Google"
5. After login, go to Settings to add your Gemini API key
