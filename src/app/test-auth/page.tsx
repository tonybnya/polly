'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestAuth() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      console.log('Testing connection...')
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      
      // Test basic connection
      const { data, error } = await supabase.auth.getSession()
      setResult({ type: 'connection', data, error })
      console.log('Connection test result:', { data, error })
    } catch (err) {
      console.error('Connection test failed:', err)
      setResult({ type: 'connection', error: err })
    } finally {
      setLoading(false)
    }
  }

  const testSignup = async () => {
    setLoading(true)
    try {
      console.log('Testing signup...')
      const { data, error } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123',
      })
      setResult({ type: 'signup', data, error })
      console.log('Signup test result:', { data, error })
    } catch (err) {
      console.error('Signup test failed:', err)
      setResult({ type: 'signup', error: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
        >
          Test Connection
        </button>
        
        <button 
          onClick={testSignup}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Test Signup
        </button>
      </div>

      {loading && <div className="mt-4">Loading...</div>}

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Test Result ({result.type}):</h3>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
