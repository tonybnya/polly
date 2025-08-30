import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code

  if (code) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      redirect('/polls')
    }
  }

  // If no code or error, redirect to login
  redirect('/login')
}
