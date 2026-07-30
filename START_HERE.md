# 🚀 HOW TO START SETIA COLLECTION APP

## ⚠️ IMPORTANT: You MUST Start Both Servers

Your login is failing because the **backend server is NOT running**. Follow these steps exactly:

---

## Step 1: Start Backend Server (REQUIRED!)

### Option A: Using Command Prompt
1. Open **Command Prompt** or **PowerShell**
2. Copy and paste these commands **one by one**:
   ```bash
   cd e:\setiaProject2\backend
   node server.js
   ```
3. **KEEP THIS WINDOW OPEN!** You should see:
   ```
   ✅ MongoDB Connected: cluster0.sxmljku.mongodb.net
   🚀 Server running in development mode on port 5000
   ```

### Option B: Double-click the Batch File
1. Go to folder: `e:\setiaProject2`
2. Double-click: **`start-backend.bat`**
3. **KEEP THE WINDOW OPEN!**

---

## Step 2: Start Frontend Server

### Open a NEW Terminal Window
1. Open **another** Command Prompt or PowerShell window
2. Copy and paste these commands:
   ```bash
   cd e:\setiaProject2\frontend
   npm run dev
   ```
3. Browser will open automatically at `http://localhost:5173`

### OR Double-click the Batch File
1. Go to folder: `e:\setiaProject2`
2. Double-click: **`start-frontend.bat`**

---

## Step 3: Test Login

1. Go to: `http://localhost:5173/login`
2. Use these credentials:
   - **Email**: `admin@gmail.com`
   - **Password**: `Admin@000`
3. Click **Login**

✅ **It should work now!**

---

## ❌ Troubleshooting

### "Login Failed" Error?
**Cause**: Backend server is not running

**Solution**:
1. Check if you see the backend server window open
2. Look for the message: `✅ MongoDB Connected`
3. If you don't see it, the server is not running
4. Go back to Step 1 and start the backend server

### Backend Server Shows Error?
Check the error message. Common issues:
- **Port 5000 already in use**: Close other programs using port 5000
- **MongoDB connection failed**: Check your internet connection

### Frontend Won't Start?
1. Make sure you're in the correct folder: `e:\setiaProject2\frontend`
2. Run: `npm install` (one time only)
3. Then run: `npm run dev`

---

## 📝 Quick Reference

**Backend Server**: `cd e:\setiaProject2\backend` → `node server.js`  
**Frontend Server**: `cd e:\setiaProject2\frontend` → `npm run dev`  
**Admin Login**: `admin@gmail.com` / `Admin@000`

---

## ✅ Success Checklist

- [ ] Backend server window is open and shows "MongoDB Connected"
- [ ] Frontend server window is open and shows "Local: http://localhost:5173"
- [ ] Browser opened to http://localhost:5173
- [ ] Login page loads without errors
- [ ] Can login with admin credentials

**If all checkboxes are checked, login will work!**
