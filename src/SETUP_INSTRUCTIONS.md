# 🛠️ Local Development Setup

## Quick Setup for Testing Locally

The app is currently configured to work **without** a database for local testing. All data is mocked and stored in memory.

### Running the App Locally

1. **No installation needed** - The app runs in this environment
2. **Test the app** - Click around, sign up, and explore features
3. **All data is temporary** - Refreshing the page will reset everything

---

## 🔄 Connecting to Real Database (Optional)

If you want to connect to a real Supabase database for persistent data:

### Step 1: Install Supabase Client

Uncomment this line in `/package.json`:

```json
"dependencies": {
  "@supabase/supabase-js": "^2.39.0",  // Uncomment this line
  "react": "^18.2.0",
  ...
}
```

Then run:
```bash
npm install
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Run the SQL from `QUICK_START.md` in the SQL Editor

### Step 3: Add Environment Variables

Create a file named `.env.local` in the root directory:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get these values from: Supabase Dashboard → Settings → API

### Step 4: Enable Real Database in Code

In `/lib/supabase.ts`, uncomment these lines:

```typescript
// Line 3: Uncomment this
import { createClient } from '@supabase/supabase-js';

// Lines 18-20: Uncomment these
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}
```

### Step 5: Restart the App

```bash
npm run dev
```

Now the app will use real database storage!

---

## 🧪 Current Setup (Mock Mode)

The app currently runs in **mock mode** which means:

✅ **Works immediately** - No setup required
✅ **Perfect for testing** - Try all features
✅ **No database needed** - Everything works locally
❌ **Data is temporary** - Lost on page refresh
❌ **No real authentication** - Simulated login

### Mock Features:
- Sign up creates temporary user
- Sign in accepts any credentials
- Training progress stored in memory
- All dashboard data is sample data

---

## 📱 For Production Deployment

When you're ready to deploy to production:

1. Follow **QUICK_START.md** for fast deployment (30 min)
2. Or follow **DEPLOYMENT_GUIDE.md** for detailed instructions
3. Set up real Supabase database
4. Deploy to Vercel/Netlify with environment variables

---

## 🔍 File Structure

```
├── lib/supabase.ts          # Database functions (currently mocked)
├── components/AuthPage.tsx   # Login/signup UI
├── App.tsx                   # Main app component
├── .env.example              # Example environment variables
└── .env.local                # Your actual config (create this)
```

---

## 🚀 What's Next?

### For Testing:
1. Just use the app as-is!
2. Sign up with any email
3. Explore all features
4. No setup required

### For Production:
1. Follow QUICK_START.md
2. Set up Supabase database
3. Deploy to Vercel
4. Share with your team

---

## 💡 Tips

- **Testing locally?** Just use the app, no setup needed
- **Want persistence?** Follow steps above to connect Supabase
- **Ready to deploy?** Skip local setup and go straight to QUICK_START.md
- **Hit an error?** Check that .env.local exists and has correct values

---

## 🆘 Troubleshooting

### Error: "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
**Solution:** This is fixed! The app now works without environment variables.

### Want to use real database locally?
**Solution:** Follow "Connecting to Real Database" section above

### App works but data disappears on refresh?
**This is normal in mock mode!** Connect to Supabase for persistent data.

---

**The app is ready to use right now in mock mode, or you can connect to Supabase for production use!**
