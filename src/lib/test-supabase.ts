import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return { success: false, error }
    }
    
    console.log('Connection successful!')
    return { success: true, data }
  } catch (err) {
    console.error('Connection test failed:', err)
    return { success: false, error: err }
  }
}

export async function testAuthSignup(email: string, password: string) {
  try {
    console.log('Testing auth signup...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    console.log('Signup response:', { data, error })
    return { data, error }
  } catch (err) {
    console.error('Signup test failed:', err)
    return { data: null, error: err }
  }
}
