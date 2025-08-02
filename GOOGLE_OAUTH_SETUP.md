# Google OAuth Setup Guide for CubeMail

## 🚨 Current Issue
**Error**: `Access blocked: CubeMail has not completed the Google verification process`
**Error Code**: `403: access_denied`

## ✅ What Was Fixed in Code
1. **OAuth Scopes**: Updated from `https://mail.google.com/` to proper Google API scopes
2. **Authentication Flow**: Improved error handling and token management
3. **User Interface**: Added error display with helpful messages
4. **Debugging**: Added comprehensive logging for troubleshooting

## 🛠 Required Google Cloud Console Configuration

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to "APIs & Services" → "Credentials"

### Step 2: Configure OAuth Consent Screen
1. Go to "APIs & Services" → "OAuth consent screen"
2. **For Development/Testing**:
   - Set User Type to **"External"**
   - Fill in required fields:
     - App name: **CubeMail**
     - User support email: **your-email@gmail.com**
     - Developer contact: **your-email@gmail.com**
3. **Add Test Users** (CRITICAL for testing):
   - In "Test users" section, click "Add users"
   - Add your Gmail address: **eclipsegk10@gmail.com**
   - Add any other emails you want to test with

### Step 3: Configure OAuth Client
1. Go to "APIs & Services" → "Credentials"
2. Find your OAuth 2.0 Client ID: `409233235204-ujvlvehbk8o9b9f5dv7sge3dqfl0q6at.apps.googleusercontent.com`
3. Click "Edit" (pencil icon)
4. **Add Authorized redirect URIs**:
   ```
   http://localhost:3000
   http://localhost:3000/CubeMail
   http://127.0.0.1:3000
   ```
5. **Remove any invalid URIs** like `storagerelay://`

### Step 4: Enable Required APIs
1. Go to "APIs & Services" → "Library"
2. Search and enable:
   - **Gmail API**
   - **Google+ API** (if available)

### Step 5: Configure Scopes (if needed)
In OAuth consent screen → Scopes:
- Add: `https://www.googleapis.com/auth/gmail.readonly`
- Add: `https://www.googleapis.com/auth/gmail.send`
- Add: `https://www.googleapis.com/auth/gmail.modify`

## 🔧 Quick Fix for Testing

### Option A: Add Test Users (Recommended)
1. In Google Cloud Console → OAuth consent screen
2. Scroll to "Test users" section
3. Add your email: `eclipsegk10@gmail.com`
4. Save changes
5. Try authenticating again

### Option B: Publishing Status (Advanced)
If you have a Google Workspace account:
1. Set OAuth consent screen to "Internal"
2. This bypasses verification for your domain

## 🎯 Expected Behavior After Fix

After proper configuration:
1. Click "Sign in with Google"
2. Google popup appears
3. Select your test user account
4. Grant permissions for Gmail access
5. Successfully authenticate and access CubeMail

## 🚨 Important Notes

### For Development
- **Test users can use the app** without verification
- Add all developers/testers as test users
- App works normally for test users

### For Production
- Google verification required for public Gmail access
- Submit app for Google review
- Provide privacy policy and terms of service
- Meet Google's security requirements

## 🔍 Troubleshooting

### Error: "access_denied"
- ✅ Add your email as test user
- ✅ Check redirect URIs are correct
- ✅ Ensure Gmail API is enabled

### Error: "redirect_uri_mismatch"
- ✅ Add `http://localhost:3000` to authorized URIs
- ✅ Check exact URL in browser address bar

### Error: "invalid_client"
- ✅ Verify CLIENT_ID in .env file
- ✅ Check client ID matches Google Console

## 📝 Current Configuration

**Client ID**: `409233235204-ujvlvehbk8o9b9f5dv7sge3dqfl0q6at.apps.googleusercontent.com`
**API Key**: `AIzaSyA-b8FQiFcAsVgSf-a0h1Ci3u079tf9KHw`
**Scopes**: Gmail read, send, modify permissions

## ✅ Next Steps

1. **Configure Google Cloud Console** (follow steps above)
2. **Add test users** including `eclipsegk10@gmail.com`
3. **Test authentication** with the updated code
4. **Verify Gmail API access** works properly

The code is now ready - you just need to configure the Google Cloud Console settings!