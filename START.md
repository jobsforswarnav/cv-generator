# How to Start the Application

## Start Both Servers:

```bash
npm run dev:all
```

OR start them separately:

## Terminal 1 - Backend:
```bash
npm run dev
```

## Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

## Access the App:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Troubleshooting:

If "Sign in with Google" doesn't work:

1. Make sure backend is running on port 3001
2. Check browser console for errors (F12)
3. Verify Google OAuth settings:
   - Authorized JavaScript origins: http://localhost:5173
   - Authorized redirect URIs: http://localhost:3001/auth/google/callback
4. Restart both servers after changing .env
