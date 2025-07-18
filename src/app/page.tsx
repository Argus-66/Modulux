'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (status === 'authenticated' && session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Only show homepage content to unauthenticated users
  if (status === 'unauthenticated') {
    return (
      <Layout>
        <Hero />
        <Features />
      </Layout>
    )
  }

  // Return null while redirecting authenticated users
  return null
}
