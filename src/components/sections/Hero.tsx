'use client'

import { useSession, signIn } from 'next-auth/react'
import Button from '../ui/Button'

export default function Hero() {
  const { data: session } = useSession()

  const handleGetStarted = () => {
    if (session) {
      window.location.href = '/dashboard'
    } else {
      signIn('github')
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 mb-8">
            <span className="text-blue-600 text-sm font-medium">🚀 New: AI-Powered Portfolio Builder</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Build Your Dream Portfolio with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Modulux
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Create stunning, professional portfolios in minutes with our drag-and-drop builder. 
            No coding required — just pure creativity and seamless deployment to showcase your work.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="primary" 
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-8 py-4 shadow-lg hover:shadow-xl"
            >
              {session ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Go to Dashboard
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Building Free
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Live Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free to start
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No coding required
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Deploy instantly
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
