/**
 * Simple test to verify Supabase connection
 * Import and call this from your page to test
 */

import { createClient } from './client';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');

  const supabase = createClient();

  // Test 1: Check if client was created
  console.log('✅ Supabase client created:', !!supabase);

  // Test 2: Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('❌ Auth error:', authError);
    return false;
  }

  if (!user) {
    console.log('⚠️ Not authenticated');
    return false;
  }

  console.log('✅ Authenticated as:', user.email);
  console.log('   User ID:', user.id);

  // Test 3: Try a simple query to profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('❌ Profile query error:', profileError);
    return false;
  }

  console.log('✅ Profile query successful:', profile);

  // Test 4: Try querying chat_participants
  console.log('🔍 Testing chat_participants access...');
  const { data: participants, error: participantsError } = await supabase
    .from('chat_participants')
    .select('*')
    .eq('user_id', user.id);

  console.log('Result:', { participants, participantsError });

  if (participantsError) {
    console.error('❌ chat_participants error:', participantsError);
    console.error('   Error details:', JSON.stringify(participantsError, null, 2));
    return false;
  }

  console.log('✅ chat_participants query successful');
  console.log('   Found', participants?.length || 0, 'participations');

  return true;
}
