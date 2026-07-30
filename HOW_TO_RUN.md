# How to Run SETIA COLLECTION Application

## The Problem You're Facing

The error `[vite] http proxy error: /api/banners?type=offer ECONNREFUSED` occurs because:
- Your **frontend** (Vite) is running on port 5173
- Your **backend** (Express) is NOT running on port 5000
- When frontend tries to call `/api/banners`, Vite proxies it to `http://localhost:5000`
- Since backend isn't running, the connection is refused

## Prerequisites

Before running the application, ensure you have:

1. **Node.js** installed (v16 or higher)
2. **MongoDB** installed and running
   - Download from: https://www.mongodb.com/try/download/community
   - Start MongoDB service:
     ```powershell
     # Option 1: If MongoDB is installed as a service
     net start MongoDB
     
     # Option 2: Run MongoDB manually
     mongod --dbpath="C:\data\db"
     ```

## Solution: Run Both Servers

You need to run BOTH the backend and frontend servers simultaneously.

### Method 1: Using Two Terminals (Recommended for Debugging)

#### Terminal 1 - Backend Server
```powershell
cd e:\setiaProject2\backend
npm run dev
```

You should see:
```
🚀 Server running in development mode on port 5000
✅ MongoDB Connected: localhost
```

#### Terminal 2 - Frontend Server
```powershell
cd e:\setiaProject2\frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### Method 2: Using Single Command (After Installing Dependencies)

From the root directory:

```powershell
cd e:\setiaProject2
npm install
npm run dev
```

This will run both servers concurrently.

## Troubleshooting

### Issue 1: MongoDB Connection Error

**Error:** `❌ Error: connect ECONNREFUSED ::1:27017`

**Solution:**
1. Make sure MongoDB is installed
2. Start MongoDB service:
   ```powershell
   net start MongoDB
   ```
3. Or run MongoDB manually:
   ```powershell
   mongod --dbpath="C:\data\db"
   ```

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Find and kill the process using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```

### Issue 3: Dependencies Not Installed

**Error:** `Cannot find module 'express'`

**Solution:**
```powershell
# Install backend dependencies
cd e:\setiaProject2\backend
npm install

# Install frontend dependencies
cd e:\setiaProject2\frontend
npm install
```

## Verification Steps

1. **Check Backend is Running:**
   - Open browser: http://localhost:5000/api/health
   - Should see: `{"message":"SETIA COLLECTION API is running!"}`

2. **Check Frontend is Running:**
   - Open browser: http://localhost:5173
   - Should see your application homepage

3. **Check API Proxy is Working:**
   - Frontend should successfully fetch data from `/api/banners`
   - No more ECONNREFUSED errors in terminal

## Quick Start Commands

```powershell
# 1. Start MongoDB (if not running as service)
net start MongoDB

# 2. Open Terminal 1 - Start Backend
cd e:\setiaProject2\backend
npm run dev

# 3. Open Terminal 2 - Start Frontend  
cd e:\setiaProject2\frontend
npm run dev

# 4. Open browser
# http://localhost:5173
```

## Environment Variables

Make sure `e:\setiaProject2\backend\.env` contains:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/setia-collection
JWT_SECRET=setia_collection_super_secret_jwt_key_2024_change_in_production
FRONTEND_URL=http://localhost:5173
```

## Summary

✅ **Always run BOTH servers** - backend on port 5000, frontend on port 5173
✅ **Ensure MongoDB is running** before starting the backend
✅ **Check both servers are running** before testing the application
