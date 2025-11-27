/**
 * Quick Reset Script - Delete all users and register 3 managers
 * 
 * This is a simple script that can be pasted into the browser console
 * when the app is running.
 * 
 * Usage:
 * 1. Start the dev server: npm run dev
 * 2. Open http://localhost:5173 in your browser
 * 3. Open the browser console (F12)
 * 4. Copy and paste this entire file into the console
 * 5. Press Enter
 */

(async function() {
  console.log('🚀 Sky266 Quick Reset Script');
  console.log('============================\n');

  try {
    // Import the database module
    console.log('📦 Importing database module...');
    const { db } = await import('./src/lib/supabase.ts');
    
    // Step 1: Delete all users
    console.log('\n🗑️  Step 1: Deleting all users...');
    const deleteResult = await db.deleteAllUsers();
    
    if (deleteResult.error) {
      console.error('❌ Error deleting users:', deleteResult.error);
      return;
    }
    
    console.log('✅ All users deleted successfully');
    
    // Step 2: Register 3 managers
    console.log('\n➕ Step 2: Registering 3 managers...');
    
    const managers = [
      { email: 'manager1@sky266.com', password: 'Manager123!', name: 'Manager One' },
      { email: 'manager2@sky266.com', password: 'Manager123!', name: 'Manager Two' },
      { email: 'manager3@sky266.com', password: 'Manager123!', name: 'Manager Three' },
    ];
    
    let successCount = 0;
    
    for (const manager of managers) {
      console.log(`\n📝 Creating ${manager.name}...`);
      const result = await db.signUp(manager.email, manager.password, manager.name, 'manager');
      
      if (result.error) {
        console.error(`❌ Failed to create ${manager.name}:`, result.error);
      } else {
        console.log(`✅ Created ${manager.name} (${manager.email})`);
        successCount++;
      }
    }
    
    // Summary
    console.log('\n============================');
    console.log('✅ Reset Complete!');
    console.log(`\n${successCount} manager(s) created successfully\n`);
    
    if (successCount > 0) {
      console.log('You can now sign in with:');
      managers.forEach(m => {
        console.log(`  • ${m.email} / ${m.password}`);
      });
    }
    
    console.log('\n============================\n');
    
  } catch (error) {
    console.error('❌ Error during reset:', error);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure the dev server is running (npm run dev)');
    console.log('2. Make sure you are on http://localhost:5173');
    console.log('3. Check that Supabase is configured correctly');
  }
})();

