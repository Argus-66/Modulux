'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Layout from '@/components/layout/Layout'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/')
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) return null

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <Card variant="elevated" className="p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={session.user?.image || ''}
                  alt={session.user?.name || 'User'}
                  className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {session.user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Ready to build something amazing with Modulux?
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last login: Today
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account verified
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Active Portfolios</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Templates Used</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Deployments</div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="elevated" className="p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Portfolio</h3>
              <p className="text-gray-600 mb-4">Start building your portfolio from scratch with our intuitive builder</p>
              <Button variant="primary" className="w-full">
                Create Portfolio
              </Button>
            </Card>

            <Card variant="elevated" className="p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Use Template</h3>
              <p className="text-gray-600 mb-4">Choose from our professionally designed templates to get started quickly</p>
              <Button variant="secondary" className="w-full">
                Browse Templates
              </Button>
            </Card>

            <Card variant="elevated" className="p-6 text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Portfolio</h3>
              <p className="text-gray-600 mb-4">Import an existing portfolio, resume, or LinkedIn profile</p>
              <Button variant="outline" className="w-full">
                Import
              </Button>
            </Card>
          </div>

          {/* My Portfolios Section */}
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Portfolios</h2>
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New
              </Button>
            </div>
            
            {/* Empty State */}
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No portfolios yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Create your first portfolio to showcase your work and attract new opportunities. It only takes a few minutes!
              </p>
              <Button variant="primary" size="lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Your First Portfolio
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
