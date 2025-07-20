'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PortfolioSection } from '@/types/portfolio'
import PortfolioPreview from './PortfolioPreview'
import { Plus } from 'lucide-react'

interface BuilderCanvasProps {
    sections: PortfolioSection[]
    selectedSectionId: string | null
    setSelectedSectionId: (id: string | null) => void
    isPreviewMode: boolean
}

export default function BuilderCanvas({
    sections,
    selectedSectionId,
    setSelectedSectionId,
    isPreviewMode
}: BuilderCanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas'
    })

    return (
        <div className="flex-1 flex flex-col">
            <div
                ref={setNodeRef}
                className={`flex-1 overflow-y-auto bg-gray-50 p-6 transition-colors ${isOver ? 'bg-blue-50' : ''
                    }`}
            >
                {sections.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center max-w-md mx-auto">
                            <div className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center mx-auto mb-6 transition-colors ${isOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-100'
                                }`}>
                                <Plus className={`w-8 h-8 transition-colors ${isOver ? 'text-blue-500' : 'text-gray-400'
                                    }`} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Start Building Your Portfolio
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Drag and drop components from the sidebar to create your portfolio.
                                Start with a Hero section to introduce yourself!
                            </p>
                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm transition-colors ${isOver
                                    ? 'bg-blue-200 text-blue-800'
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Drop components here
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
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
                            />
                        </SortableContext>
                    </div>
                )}
            </div>
        </div>
    )
}
