# MongoDB Atlas Setup Guide

## Free Database Integration

Your anime admin panel now supports **MongoDB Atlas** (Free tier) for production data storage.

### Step 1: Create MongoDB Atlas Account

1. Go to https://cloud.mongodb.com
2. Click "Sign Up for Free"
3. Create account with email/password

### Step 2: Create Free Cluster

1. Click "Create" → Choose **M0 (Free forever)**
2. Select your cloud provider (AWS recommended)
3. Choose region closest to you
4. Click "Create Cluster" (takes ~15 seconds)

### Step 3: Set Database Credentials

1. Go to "Database Access"
2. Click "Add New Database User"
3. Set Username: `admin` (or your choice)
4. Set Password: (strong password - save it!)
5. Click "Add User"

### Step 4: Add Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Add My Current IP Address"
   - For development only, use this
   - For production, use `0.0.0.0/0` (less secure)
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to "Databases" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" from driver list
4. Copy the connection string
5. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dbname?retryWrites=true&w=majority`

### Step 6: Add Environment Variables to Replit

1. Go to your Replit project
2. Click "Secrets" (lock icon)
3. Add new secret:
   - **Key:** `MONGODB_URI`
   - **Value:** Your connection string from Step 5
   - Replace `<username>` with your database user
   - Replace `<password>` with your password
   - Replace `<dbname>` with `anime-db`
4. Click "Add Secret"

### Step 7: Install Backend Dependencies

Run in terminal:
```bash
cd ./app-7uoulm93wsn5
npm install express mongoose cors dotenv
```

### Step 8: Start Backend Server

Run in terminal:
```bash
cd ./app-7uoulm93wsn5
node server.js
```

You should see: `✓ MongoDB connected` and `✓ Server running on port 5001`

### Step 9: Update API Import (Important!)

In your React code, change the import at top of Admin.tsx:

**Current:**
```typescript
import { animeApi, episodeApi, profileApi } from '@/db/api';
```

**Change to:**
```typescript
import { animeApi, episodeApi, profileApi } from '@/db/api-mongo';
```

### Step 10: Deployment Setup

For Vercel/Netlify, update your environment:

**Production Environment Variable:**
- Go to your hosting platform settings
- Add `MONGODB_URI` with your connection string
- Add `VITE_API_URL` with your backend URL

## Troubleshooting

**"MongoDB connection error"**
- Check connection string is correct
- Verify IP is whitelisted in Network Access
- Ensure password special characters are URL-encoded

**"Cannot connect to API"**
- Verify backend is running on port 5001
- Check `VITE_API_URL` environment variable
- Ensure CORS is enabled (already in server.js)

**"Free tier MongoDB warnings"**
- Free tier: 512 MB storage (plenty for admin data)
- Shared resources (performance varies)
- No backups included
- Perfect for development and small-scale admin panels

## Architecture

```
React Frontend (Vite)
        ↓ HTTP Requests
Node.js Backend (Express)
        ↓ Database Queries
MongoDB Atlas (Free Tier)
```

All anime and episodes data is now stored in MongoDB Cloud!

---

**Questions?** Check MongoDB Atlas docs: https://www.mongodb.com/docs/atlas/
