'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PortfolioSection } from '@/types/portfolio'
import PortfolioPreview from './PortfolioPreview'
import { Plus, Ruler, Monitor } from 'lucide-react'

interface BuilderCanvasProps {
  sections: PortfolioSection[]
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  isPreviewMode: boolean
  onUpdateSection?: (sectionId: string, data: any) => Promise<void>
  onDeleteSection?: (sectionId: string) => void
  onDuplicateSection?: (sectionId: string) => void
}

export default function BuilderCanvas({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  isPreviewMode,
  onUpdateSection,
  onDeleteSection,
  onDuplicateSection
}: BuilderCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas'
  })

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Info Bar */}
      {!isPreviewMode && (
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Full Width Preview (1400px)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Ruler className="w-4 h-4" />
              <span>Professional Layout</span>
            </div>
          </div>
          <div className="text-gray-500">
            {sections.length} sections • Drag components to add them
          </div>
        </div>
      )}

      <div 
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto transition-colors ${
          isOver ? 'bg-blue-50' : 'bg-gray-50'
        }`}
      >
        {sections.length === 0 ? (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-2xl mx-auto">
              {/* Much Larger Visual Portfolio Boundary */}
              <div className={`border-4 border-dashed rounded-xl p-20 transition-colors ${
                isOver ? 'border-blue-400 bg-blue-100' : 'border-gray-300 bg-white'
              }`}>
                <div className={`w-24 h-24 rounded-full border-3 border-dashed flex items-center justify-center mx-auto mb-8 transition-colors ${
                  isOver ? 'border-blue-500 bg-blue-200' : 'border-gray-400 bg-gray-100'
                }`}>
                  <Plus className={`w-12 h-12 transition-colors ${
                    isOver ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Start Building Your Portfolio
                </h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Drag sections from the sidebar into this expanded canvas area. Full creative control with text positioning, colors, and styling.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="text-left">
                    <p>📏 <strong>Canvas:</strong> Full-width responsive</p>
                    <p>🎯 <strong>Drop Zone:</strong> Drag components anywhere</p>
                  </div>
                  <div className="text-left">
                    <p>✏️ <strong>Text:</strong> Click to edit with full styling</p>
                    <p>🎨 <strong>Colors:</strong> Customize everything</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Much Larger Portfolio Container
          <div className="w-full max-w-7xl mx-auto">
            <div className="bg-white shadow-2xl border-4 border-gray-200 rounded-xl overflow-hidden mx-6 my-8">
              {!isPreviewMode && (
                <div className="bg-gradient-to-r from-gray-100 to-blue-50 border-b border-gray-200 p-4 text-center">
                  <span className="text-sm font-semibold text-gray-700">
                    📄 PORTFOLIO LIVE PREVIEW - This is how visitors will see your portfolio
                  </span>
                </div>
              )}
              
              <SortableContext 
                items={sections.map(s => s.id)} 
                strategy={verticalListSortingStrategy}
              >
                <PortfolioPreview
                  sections={sections}
                  selectedSectionId={selectedSectionId}
                  setSelectedSectionId={setSelectedSectionId}
                  isPreviewMode={isPreviewMode}
                  onUpdateSection={onUpdateSection}
                  onDeleteSection={onDeleteSection}
                  onDuplicateSection={onDuplicateSection}
                />
              </SortableContext>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
