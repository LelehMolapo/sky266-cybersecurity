# User Management Guide

This guide explains how to delete all registered users and register 3 managers for the Sky266 Cybersecurity Awareness App.

## Option 1: Using the Admin Page (Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the admin page:**
   - Navigate to `http://localhost:5173/admin.html` in your browser

3. **Delete all users:**
   - Click the "Delete All Users" button
   - Confirm the action when prompted

4. **Register 3 managers:**
   - Click the "Register 3 Managers" button
   - Wait for the success messages

5. **Default Manager Credentials:**
   - Manager 1: `manager1@sky266.com` / `Manager123!`
   - Manager 2: `manager2@sky266.com` / `Manager123!`
   - Manager 3: `manager3@sky266.com` / `Manager123!`

## Option 2: Using Browser Console

If you prefer to use the browser console:

1. **Start the development server and open the app:**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173`

2. **Open the browser console** (F12 or Right-click → Inspect → Console)

3. **Delete all users:**
   ```javascript
   // Import the db module
   const { db } = await import('./src/lib/supabase.ts');
   
   // Delete all users
   const result = await db.deleteAllUsers();
   console.log('Delete result:', result);
   ```

4. **Register 3 managers:**
   ```javascript
   // Import the db module (if not already imported)
   const { db } = await import('./src/lib/supabase.ts');
   
   // Register managers
   const managers = [
     { email: 'manager1@sky266.com', password: 'Manager123!', name: 'Manager One' },
     { email: 'manager2@sky266.com', password: 'Manager123!', name: 'Manager Two' },
     { email: 'manager3@sky266.com', password: 'Manager123!', name: 'Manager Three' },
   ];
   
   for (const manager of managers) {
     const result = await db.signUp(manager.email, manager.password, manager.name, 'manager');
     console.log(`Created ${manager.name}:`, result);
   }
   ```

## Option 3: Using Supabase Dashboard

If you have access to the Supabase dashboard:

1. **Go to your Supabase project dashboard**
2. **Navigate to Table Editor**
3. **Delete users from the `users` table:**
   - Select all rows
   - Click "Delete" button
   - Confirm deletion

4. **Also delete from related tables:**
   - `training_progress` table
   - `certificates` table

5. **Then use Option 1 or 2 to register the 3 managers**

## Verifying the Setup

After registering the managers:

1. **Check the user list:**
   - On the admin page, click "Refresh User List"
   - You should see 3 manager accounts

2. **Test login:**
   - Go to the main app (`http://localhost:5173`)
   - Try logging in with one of the manager credentials
   - You should see the manager dashboard

## Troubleshooting

### "Maximum 3 manager accounts allowed" error
- This means there are already 3 managers in the database
- Delete all users first, then register the new managers

### "Supabase not initialized" error
- Make sure you have set up your `.env` file with Supabase credentials
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set

### Users not appearing after registration
- Check the browser console for errors
- Verify your Supabase connection
- Try refreshing the page

## Notes

- The app limits manager accounts to a maximum of 3
- All passwords should be strong (at least 8 characters with uppercase, lowercase, and special characters)
- You can customize the manager credentials by editing the values in the admin page script or console commands
- After deleting users, you may need to also delete them from Supabase Auth if you're using real Supabase (not mock mode)

## Security Warning

⚠️ **Important:** The admin page should NOT be deployed to production. It's only for development and testing purposes. In production, user management should be done through:
- Supabase Dashboard
- Secure admin API endpoints
- Proper authentication and authorization

