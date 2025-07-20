'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { Portfolio } from '@/types/portfolio'
import { ArrowLeft, Save, Eye, Edit3, Globe, Loader2 } from 'lucide-react'

interface BuilderHeaderProps {
  portfolio: Portfolio
  isPreviewMode: boolean
  setIsPreviewMode: (mode: boolean) => void
  isSaving: boolean
}

export default function BuilderHeader({ 
  portfolio,
  isPreviewMode, 
  setIsPreviewMode,
  isSaving
}: BuilderHeaderProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const router = useRouter()

  const handlePublish = async () => {
    try {
      setIsPublishing(true)
      const response = await fetch(`/api/portfolios/${portfolio._id}/publish`, {
        method: 'POST',
      })

      if (response.ok) {
        // TODO: Show success notification
        console.log('Portfolio published successfully!')
      }
    } catch (error) {
      console.error('Error publishing portfolio:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
        
        <div className="h-6 w-px bg-gray-300"></div>
        
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {portfolio.name}
          </h1>
          <p className="text-sm text-gray-500">
            {portfolio.sections.length} sections • {portfolio.status}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Save Status */}
        {isSaving && (
          <div className="flex items-center text-sm text-gray-500">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setIsPreviewMode(false)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              !isPreviewMode 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isPreviewMode 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublish}
            isLoading={isPublishing}
            disabled={portfolio.sections.length === 0}
          >
            <Globe className="w-4 h-4 mr-2" />
            {portfolio.status === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>
    </header>
  )
}
