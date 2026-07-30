# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas cloud database for the SETIA COLLECTION project.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you already have one)
3. Complete the registration process

## Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"** or **"Create"**
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region (choose one closest to you)
4. Give your cluster a name (or keep the default)
5. Click **"Create Cluster"** (this may take 3-5 minutes)

## Step 3: Create Database User

1. In the left sidebar, click **"Database Access"** under Security
2. Click **"Add New Database User"**
3. Choose **"Password"** as authentication method
4. Enter a username (e.g., `setia-admin`)
5. Click **"Autogenerate Secure Password"** or create your own strong password
6. **IMPORTANT:** Copy and save this password somewhere safe - you'll need it for the connection string
7. Under "Database User Privileges", select **"Read and write to any database"**
8. Click **"Add User"**

## Step 4: Configure Network Access

1. In the left sidebar, click **"Network Access"** under Security
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **Note:** For production, you should restrict this to specific IP addresses
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **"Node.js"** as the driver and select the latest version
5. Copy the connection string - it will look like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open the file: `backend/.env`
2. Find the line that starts with `MONGODB_URI=`
3. Replace the entire connection string with your MongoDB Atlas connection string
4. **IMPORTANT:** Replace `<username>` with your database username
5. **IMPORTANT:** Replace `<password>` with your database password (the one you saved earlier)
6. Add the database name `/setia-collection` before the `?` in the connection string

### Example:

**Before:**
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/setia-collection?retryWrites=true&w=majority
```

**After (with your actual credentials):**
```
MONGODB_URI=mongodb+srv://setia-admin:MySecurePassword123@cluster0.abc123.mongodb.net/setia-collection?retryWrites=true&w=majority
```

## Step 7: Test the Connection

1. Open terminal in the `backend` folder
2. Start the server:
   ```bash
   npm start
   ```
3. Look for this message in the console:
   ```
   ✅ MongoDB Connected: cluster0.abc123.mongodb.net
   ```
4. If you see this message, congratulations! Your MongoDB Atlas setup is complete! 🎉

## Troubleshooting

### Error: "MongoServerError: bad auth"
- Double-check your username and password in the connection string
- Make sure there are no special characters that need URL encoding in your password
- If your password contains special characters like `@`, `#`, `%`, etc., you need to URL encode them

### Error: "MongooseServerSelectionError"
- Check your network access settings in MongoDB Atlas
- Make sure you've allowed access from your IP address (or 0.0.0.0/0 for anywhere)
- Wait a few minutes for the network access changes to take effect

### Error: "Could not connect to any servers"
- Verify your internet connection
- Check if the cluster is still being created (wait 3-5 minutes)
- Ensure the connection string is copied correctly

## Security Best Practices

1. **Never commit your .env file to Git** - it's already in `.gitignore`
2. **Use strong passwords** for database users
3. **Restrict IP access** in production to only your server's IP
4. **Rotate passwords** regularly
5. **Use different credentials** for development and production

## Need Help?

If you encounter any issues, check the [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/) or contact support.
