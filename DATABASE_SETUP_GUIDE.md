# Database Setup Guide for Sky266 Cybersecurity App

## 1. Supabase Project Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new project: "sky266-cybersecurity"
4. Choose region closest to your users
5. Set strong database password

### Get Project Credentials
1. Go to Project Settings → API
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 2. Database Schema Setup

### Run SQL Schema
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents from `database/schema.sql`
3. Click "Run" to create all tables and policies

### Verify Tables Created
Check these tables exist:
- `profiles` - User information
- `training_progress` - Progress tracking
- `certificates` - Earned certificates

## 3. Authentication Configuration

### Email Settings
1. Go to Authentication → Settings
2. Enable "Enable email confirmations"
3. Set "Site URL" to your domain: `https://your-app.vercel.app`
4. Configure email templates (optional)

### Email Provider (Optional)
For production, configure SMTP:
1. Go to Authentication → Settings → SMTP Settings
2. Add your email provider credentials
3. Test email sending

## 4. Environment Variables

### Update .env.local
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel Deployment
Add these environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 5. Row Level Security (RLS)

The schema automatically sets up RLS policies:
- Users can only see their own data
- Managers can see all employee data
- Secure by default

## 6. Testing Database Connection

### Test Locally
1. Update `.env.local` with your credentials
2. Run `npm run dev`
3. Try creating an account
4. Check Supabase dashboard for new user

### Test in Production
1. Deploy to Vercel with environment variables
2. Test signup/login flow
3. Verify data appears in Supabase dashboard

## 7. Backup and Monitoring

### Automatic Backups
Supabase provides automatic daily backups for paid plans.

### Monitoring
- Monitor usage in Supabase dashboard
- Set up alerts for high usage
- Check logs for errors

## 8. Troubleshooting

### Common Issues
1. **No emails received**: Check SMTP settings and spam folder
2. **RLS errors**: Verify policies are correctly set
3. **Connection errors**: Check environment variables

### Debug Mode
Add to your app for debugging:
```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

## 9. Production Checklist

- [ ] Database schema deployed
- [ ] Environment variables set
- [ ] Email authentication working
- [ ] RLS policies active
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] SSL/HTTPS enabled
- [ ] Domain configured

## Support

For issues:
1. Check Supabase documentation
2. Review error logs in dashboard
3. Test with sample data first