'use client'

import { useState, useRef } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { PortfolioSection } from '@/types/portfolio'
import { Plus, Grid3X3, Maximize2 } from 'lucide-react'

interface FreeformCanvasProps {
  sections: PortfolioSection[]
  selectedSectionId: string | null
  setSelectedSectionId: (id: string | null) => void
  isPreviewMode: boolean
  onUpdateSection?: (sectionId: string, data: any) => void
  onMoveSection?: (sectionId: string, position: { x: number; y: number }) => void
}

export default function FreeformCanvas({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  isPreviewMode,
  onUpdateSection,
  onMoveSection
}: FreeformCanvasProps) {
  const [showGrid, setShowGrid] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const { setNodeRef, isOver } = useDroppable({
    id: 'freeform-canvas'
  })

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedSectionId(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Canvas Controls */}
      {!isPreviewMode && (
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                showGrid ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-sm">Grid</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Maximize2 className="w-4 h-4" />
              <select 
                value={`${canvasSize.width}x${canvasSize.height}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split('x').map(Number)
                  setCanvasSize({ width, height })
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="1200x800">Desktop (1200×800)</option>
                <option value="1920x1080">Large Desktop (1920×1080)</option>
                <option value="768x1024">Tablet (768×1024)</option>
                <option value="375x812">Mobile (375×812)</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {sections.length} sections • Click anywhere to place components
          </div>
        </div>
      )}

      {/* Scrollable Canvas Container */}
      <div className="flex-1 overflow-auto p-8">
        <div
          ref={(node) => {
            setNodeRef(node)
            if (canvasRef.current) canvasRef.current = node
          }}
          onClick={handleCanvasClick}
          className={`relative mx-auto bg-white shadow-lg transition-all duration-300 ${
            isOver ? 'ring-4 ring-blue-200' : ''
          } ${showGrid ? 'bg-grid-pattern' : ''}`}
          style={{ 
            width: canvasSize.width, 
            height: canvasSize.height,
            minHeight: sections.length === 0 ? canvasSize.height : 'auto'
          }}
        >
          {/* Grid Pattern */}
          {showGrid && !isPreviewMode && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}

          {/* Empty State */}
          {sections.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center mx-auto mb-6 transition-colors ${
                  isOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-100'
                }`}>
                  <Plus className={`w-8 h-8 transition-colors ${
                    isOver ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Design Your Portfolio Canvas
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag components from the sidebar and place them anywhere on the canvas
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>💡 Click and drag to position elements freely</p>
                  <p>🎨 Customize colors and themes in real-time</p>
                  <p>📱 Preview on different screen sizes</p>
                </div>
              </div>
            </div>
          )}

          {/* Render Sections */}
          {sections.map((section) => (
            <div
              key={section.id}
              className={`absolute cursor-move transition-all duration-200 ${
                selectedSectionId === section.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              } ${!isPreviewMode ? 'hover:shadow-lg' : ''}`}
              style={{
                left: section.position?.x || 50,
                top: section.position?.y || 50,
                zIndex: selectedSectionId === section.id ? 10 : 1
              }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedSectionId(section.id)
              }}
            >
              {/* Your section rendering logic here */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm min-w-[300px]">
                <h3 className="font-semibold capitalize mb-2">{section.type}</h3>
                <p className="text-gray-600 text-sm">Section content...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
