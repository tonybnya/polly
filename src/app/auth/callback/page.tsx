import { createActionSupabaseClient } from '@/lib/supabase-actions'
import { redirect } from 'next/navigation'

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const code = resolvedSearchParams.code

  if (code) {
    const supabase = await createActionSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      redirect('/polls')
    }
  }

  // If no code or error, redirect to login
  redirect('/login')
}
