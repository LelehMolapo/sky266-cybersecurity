/**
 * Script to delete all users and register 3 managers
 * 
 * Usage:
 * 1. Make sure you have your Supabase credentials in .env
 * 2. Run: npx tsx scripts/reset-users.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing environment variables');
  console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deleteAllUsers() {
  console.log('🗑️  Deleting all users...');
  
  try {
    // Get all users from auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('Error listing users:', listError);
      return false;
    }
    
    console.log(`Found ${users.length} users to delete`);
    
    // Delete each user from auth (this will cascade to users table if RLS is set up correctly)
    for (const user of users) {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteError) {
        console.error(`Error deleting user ${user.email}:`, deleteError);
      } else {
        console.log(`✅ Deleted user: ${user.email}`);
      }
    }
    
    // Also clean up users table directly (in case of orphaned records)
    const { error: tableError } = await supabase
      .from('users')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a dummy condition)
    
    if (tableError) {
      console.log('Note: Could not clean users table directly (this is OK if auth cascade works)');
    }
    
    console.log('✅ All users deleted successfully');
    return true;
  } catch (error) {
    console.error('Error during deletion:', error);
    return false;
  }
}

async function createManager(email: string, password: string, name: string) {
  console.log(`\n📝 Creating manager: ${name} (${email})`);
  
  try {
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { name, role: 'manager' }
    });
    
    if (authError) {
      console.error('Auth error:', authError);
      return false;
    }
    
    if (!authData.user) {
      console.error('No user returned from auth');
      return false;
    }
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role: 'manager',
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      });
    
    if (profileError) {
      console.error('Profile error:', profileError);
      return false;
    }
    
    // Create training progress
    const { error: progressError } = await supabase
      .from('training_progress')
      .insert({
        user_id: authData.user.id,
        videos_completed: 0,
        total_videos: 16,
        quizzes_passed: 0,
        total_quizzes: 10,
        overall_progress: 0,
        certificates_earned: 0,
        last_updated: new Date().toISOString(),
      });
    
    if (progressError) {
      console.error('Progress error:', progressError);
      // Continue anyway, this is not critical
    }
    
    console.log(`✅ Manager created successfully: ${name}`);
    return true;
  } catch (error) {
    console.error('Error creating manager:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Sky266 User Reset Script');
  console.log('============================\n');
  
  // Step 1: Delete all users
  const deleted = await deleteAllUsers();
  if (!deleted) {
    console.error('❌ Failed to delete users. Exiting.');
    process.exit(1);
  }
  
  console.log('\n============================');
  console.log('Now creating 3 managers...\n');
  
  // Step 2: Create 3 managers with default credentials
  const managers = [
    { email: 'manager1@sky266.com', password: 'Manager123!', name: 'Manager One' },
    { email: 'manager2@sky266.com', password: 'Manager123!', name: 'Manager Two' },
    { email: 'manager3@sky266.com', password: 'Manager123!', name: 'Manager Three' },
  ];
  
  for (const manager of managers) {
    await createManager(manager.email, manager.password, manager.name);
  }
  
  console.log('\n============================');
  console.log('✅ Reset complete!');
  console.log('\nYou can now sign in with:');
  managers.forEach(m => {
    console.log(`  - ${m.email} / ${m.password}`);
  });
  console.log('\n');
}

main().catch(console.error);

