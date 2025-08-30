'use client'

import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const { error } = await signIn(values.email, values.password)
      if (error) {
        toast.error(error.message || 'Failed to sign in')
        return
      }
      
      toast.success('Signed in successfully')
      router.push('/polls')
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSubmit, isLoading }
}

export function useRegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    setIsLoading(true)
    try {
      console.log('Attempting signup with:', { email: values.email, name: values.name })
      const { error, data } = await signUp(values.email, values.password, values.name)
      
      console.log('Signup result:', { error, data })
      
      if (error) {
        console.error('Signup error details:', error)
        toast.error(error.message || 'Failed to create account')
        return
      }
      
      toast.success('Account created successfully! Please check your email to confirm your account.')
      router.push('/login')
    } catch (error: any) {
      console.error('Signup exception:', error)
      toast.error(error.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSubmit, isLoading }
}